import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const taskApi = {
  // Fetch all tasks with optional filters
  getTasks: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined && params[key] !== 'all') {
        cleanParams[key] = params[key];
      }
    });
    const response = await api.get('/', { params: cleanParams });
    return response.data;
  },

  // Fetch single task by ID
  getTaskById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/', taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

export default taskApi;
