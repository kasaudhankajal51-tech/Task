import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import taskApi from '../api/taskApi';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);
  
  // UI View Modes: 'grid' | 'kanban' | 'list'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('taskflow_view_mode') || 'grid';
  });

  // Theme Accent: 'teal' | 'violet' | 'cyan'
  const [accentTheme, setAccentTheme] = useState(() => {
    return localStorage.getItem('taskflow_accent_theme') || 'teal';
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
  });

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success', // 'success' | 'error' | 'info'
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  }, []);

  // Save viewMode & theme to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('taskflow_accent_theme', accentTheme);
  }, [accentTheme]);

  // Fetch tasks with current filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskApi.getTasks(filters);
      if (response && response.success) {
        setTasks(response.data || []);
        setBackendConnected(true);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setBackendConnected(false);
      showToast(err.response?.data?.message || 'Failed to connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Debounced search / refetch on filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // Add new task
  const addTask = async (taskData) => {
    try {
      const response = await taskApi.createTask(taskData);
      if (response && response.success) {
        await fetchTasks();
        showToast('Task created successfully! 🎉', 'success');
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create task';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  // Quick inline add task (title + optional priority)
  const quickAddTask = async (title, priority = 'medium', dueDate = null) => {
    if (!title || !title.trim()) return false;
    try {
      const response = await taskApi.createTask({
        title: title.trim(),
        description: '',
        status: 'pending',
        priority,
        dueDate,
        completed: false,
      });
      if (response && response.success) {
        await fetchTasks();
        showToast('Task added! ⚡', 'success');
        return true;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add task';
      showToast(errMsg, 'error');
      return false;
    }
  };

  // Edit task
  const editTask = async (id, taskData) => {
    try {
      const response = await taskApi.updateTask(id, taskData);
      if (response && response.success) {
        await fetchTasks();
        showToast('Task updated successfully! ✨', 'success');
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update task';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  // Update task status (for Kanban transitions)
  const updateTaskStatus = async (id, newStatus) => {
    const isCompleted = newStatus === 'completed';
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus, completed: isCompleted } : t))
    );

    try {
      await taskApi.updateTask(id, {
        status: newStatus,
        completed: isCompleted,
      });
      showToast(`Status updated to ${newStatus.replace('-', ' ')} 🎯`, 'info');
    } catch (err) {
      await fetchTasks();
      showToast('Failed to change status', 'error');
    }
  };

  // Toggle complete
  const toggleTaskComplete = async (task) => {
    const newCompleted = !task.completed;
    const newStatus = newCompleted ? 'completed' : 'pending';

    // Optimistic UI Update
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
      showToast(
        newCompleted ? 'Task completed! Keep the momentum! 🚀' : 'Task marked as pending',
        newCompleted ? 'success' : 'info'
      );
    } catch (err) {
      await fetchTasks();
      showToast('Failed to update task status', 'error');
    }
  };

  // Remove task
  const removeTask = async (id) => {
    try {
      const response = await taskApi.deleteTask(id);
      if (response && response.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        showToast('Task deleted 🗑️', 'info');
        setIsDeleteModalOpen(false);
        setDeletingTaskId(null);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete task';
      showToast(errMsg, 'error');
    }
  };

  // Export Tasks to JSON or CSV
  const exportTasks = (format = 'json') => {
    if (tasks.length === 0) {
      showToast('No tasks to export!', 'info');
      return;
    }

    let fileContent = '';
    let mimeType = '';
    let fileName = `tasks_export_${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      fileContent = JSON.stringify(tasks, null, 2);
      mimeType = 'application/json';
      fileName += '.json';
    } else if (format === 'csv') {
      const headers = ['Title', 'Description', 'Status', 'Priority', 'Completed', 'DueDate', 'CreatedAt'];
      const rows = tasks.map((t) => [
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.completed ? 'Yes' : 'No',
        t.dueDate ? t.dueDate.split('T')[0] : '',
        t.createdAt ? t.createdAt.split('T')[0] : '',
      ]);
      fileContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      mimeType = 'text/csv;charset=utf-8;';
      fileName += '.csv';
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${tasks.length} tasks to ${format.toUpperCase()}! 📁`, 'success');
  };

  // Modal Handlers
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const openDeleteModal = (id) => {
    setDeletingTaskId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingTaskId(null);
    setIsDeleteModalOpen(false);
  };

  const openShortcutsModal = () => setIsShortcutsOpen(true);
  const closeShortcutsModal = () => setIsShortcutsOpen(false);

  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed || t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const pending = tasks.filter((t) => t.status === 'pending' && !t.completed).length;
    const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
    const overdue = tasks.filter((t) => {
      if (!t.dueDate || t.completed || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
    }).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      highPriority,
      overdue,
      completionRate,
    };
  }, [tasks]);

  const value = {
    tasks,
    loading,
    backendConnected,
    viewMode,
    setViewMode,
    accentTheme,
    setAccentTheme,
    filters,
    setFilters,
    stats,
    toast,
    showToast,
    isModalOpen,
    editingTask,
    isDeleteModalOpen,
    deletingTaskId,
    isShortcutsOpen,
    fetchTasks,
    addTask,
    quickAddTask,
    editTask,
    updateTaskStatus,
    toggleTaskComplete,
    removeTask,
    exportTasks,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    openShortcutsModal,
    closeShortcutsModal,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
