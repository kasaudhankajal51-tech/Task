import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const createClient = (endpoint = '/tasks') => {
  const token = localStorage.getItem('taskflow_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: `${API_BASE_URL}${endpoint}`,
    headers,
    timeout: 10000,
  });
};

export const authApi = {
  register: async (name, email, password) => {
    const client = createClient('/auth');
    const res = await client.post('/register', { name, email, password });
    return res.data;
  },
  login: async (email, password) => {
    const client = createClient('/auth');
    const res = await client.post('/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const client = createClient('/auth');
    const res = await client.get('/me');
    return res.data;
  },
};

export const taskApi = {
  // Fetch all tasks with optional filters
  getTasks: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== '' &&
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== 'all'
      ) {
        cleanParams[key] = params[key];
      }
    });
    const client = createClient('/tasks');
    const response = await client.get('/', { params: cleanParams });
    return response.data;
  },

  // Fetch single task by ID
  getTaskById: async (id) => {
    const client = createClient('/tasks');
    const response = await client.get(`/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const client = createClient('/tasks');
    const response = await client.post('/', taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    const client = createClient('/tasks');
    const response = await client.put(`/${id}`, taskData);
    return response.data;
  },

  // Delete a task
  deleteTask: async (id) => {
    const client = createClient('/tasks');
    const response = await client.delete(`/${id}`);
    return response.data;
  },
};

export default taskApi;
