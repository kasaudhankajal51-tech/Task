import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_API_URL = 'https://task-w1a5.onrender.com/api';
const STORAGE_KEY = 'taskflow_mobile_api_url';

let currentBaseUrl = DEFAULT_API_URL;

// Initialize base URL from AsyncStorage
export const initApiUrl = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentBaseUrl = saved;
    }
  } catch (e) {
    console.warn('Failed to load saved API URL:', e);
  }
  return currentBaseUrl;
};

export const getStoredApiUrl = () => currentBaseUrl;

export const setStoredApiUrl = async (newUrl) => {
  try {
    const cleanUrl = newUrl.replace(/\/+$/, '');
    await AsyncStorage.setItem(STORAGE_KEY, cleanUrl);
    currentBaseUrl = cleanUrl;
    return true;
  } catch (e) {
    console.error('Failed to save API URL:', e);
    return false;
  }
};

const createClient = () => {
  return axios.create({
    baseURL: `${currentBaseUrl}/tasks`,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 8000,
  });
};

export const taskApi = {
  // Test connection to any given URL
  testConnection: async (urlToTest) => {
    try {
      const url = urlToTest ? `${urlToTest.replace(/\/+$/, '')}/tasks` : `${currentBaseUrl}/tasks`;
      const res = await axios.get(url, { timeout: 4000 });
      return res.status === 200;
    } catch (e) {
      return false;
    }
  },

  // Fetch all tasks with optional filters
  getTasks: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((k) => {
      if (params[k] !== '' && params[k] !== null && params[k] !== undefined && params[k] !== 'all') {
        cleanParams[k] = params[k];
      }
    });
    const client = createClient();
    const res = await client.get('/', { params: cleanParams });
    return res.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const client = createClient();
    const res = await client.post('/', taskData);
    return res.data;
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    const client = createClient();
    const res = await client.put(`/${id}`, taskData);
    return res.data;
  },

  // Delete a task
  deleteTask: async (id) => {
    const client = createClient();
    const res = await client.delete(`/${id}`);
    return res.data;
  },
};

export default taskApi;
