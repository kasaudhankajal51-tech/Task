import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import taskApi, { setStoredApiUrl, getStoredApiUrl } from '../api/taskApi';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
};

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);
  const [apiUrl, setApiUrl] = useState(getStoredApiUrl());

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    sortBy: 'createdAt',
  });

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(
    async (isPullRefresh = false) => {
      if (!isAuthenticated) {
        setTasks([]);
        return;
      }

      if (isPullRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await taskApi.getTasks(filters);
        if (response && response.success) {
          setTasks(response.data || []);
          setBackendConnected(true);
        }
      } catch (err) {
        console.warn('Mobile API fetch error:', err.message);
        setBackendConnected(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isAuthenticated, filters]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, fetchTasks]);

  // Add Task
  const addTask = async (taskData) => {
    try {
      const res = await taskApi.createTask(taskData);
      if (res && res.success) {
        await fetchTasks();
        setIsTaskModalOpen(false);
        return true;
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to create task');
      return false;
    }
  };

  // Edit Task
  const editTask = async (id, taskData) => {
    try {
      const res = await taskApi.updateTask(id, taskData);
      if (res && res.success) {
        await fetchTasks();
        setIsTaskModalOpen(false);
        setEditingTask(null);
        return true;
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update task');
      return false;
    }
  };

  // Toggle complete
  const toggleTaskComplete = async (task) => {
    const newCompleted = !task.completed;
    const newStatus = newCompleted ? 'completed' : 'pending';

    // Optimistic UI
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? { ...t, completed: newCompleted, status: newStatus }
          : t
      )
    );

    try {
      await taskApi.updateTask(task._id, {
        completed: newCompleted,
        status: newStatus,
      });
    } catch (e) {
      await fetchTasks();
      Alert.alert('Sync Error', 'Failed to update status on server');
    }
  };

  // Remove Task
  const removeTask = async (id) => {
    try {
      const res = await taskApi.deleteTask(id);
      if (res && res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        setIsDeleteModalOpen(false);
        setDeletingTaskId(null);
        return true;
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to delete task');
      return false;
    }
  };

  // Update backend URL
  const updateApiUrl = async (newUrl) => {
    const success = await setStoredApiUrl(newUrl);
    if (success) {
      setApiUrl(newUrl);
      await fetchTasks();
      setIsServerModalOpen(false);
      Alert.alert('Connected', `Server URL updated to: ${newUrl}`);
    }
  };

  // Modals helpers
  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const openDeleteModal = (id) => {
    setDeletingTaskId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingTaskId(null);
    setIsDeleteModalOpen(false);
  };

  const openServerModal = () => setIsServerModalOpen(true);
  const closeServerModal = () => setIsServerModalOpen(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // Computed stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed || t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress' && !t.completed).length;
    const pending = tasks.filter((t) => t.status === 'pending' && !t.completed).length;
    const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      completionRate,
    };
  }, [tasks]);

  const value = {
    tasks,
    loading,
    refreshing,
    backendConnected,
    apiUrl,
    filters,
    setFilters,
    stats,
    isTaskModalOpen,
    editingTask,
    isDeleteModalOpen,
    deletingTaskId,
    isServerModalOpen,
    isProfileModalOpen,
    fetchTasks,
    addTask,
    editTask,
    toggleTaskComplete,
    removeTask,
    updateApiUrl,
    openCreateModal,
    openEditModal,
    closeTaskModal,
    openDeleteModal,
    closeDeleteModal,
    openServerModal,
    closeServerModal,
    openProfileModal,
    closeProfileModal,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export default TaskContext;
