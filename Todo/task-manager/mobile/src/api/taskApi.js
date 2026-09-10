import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_API_URL = 'https://task-w1a5.onrender.com/api';
const STORAGE_API_URL_KEY = 'taskflow_mobile_api_url';
const STORAGE_TOKEN_KEY = 'taskflow_auth_token';
const STORAGE_USER_KEY = 'taskflow_auth_user';

let currentBaseUrl = DEFAULT_API_URL;
let currentToken = null;

// Initialize base URL and Auth Token from AsyncStorage
export const initApiConfig = async () => {
  try {
    const [savedUrl, savedToken] = await Promise.all([
      AsyncStorage.getItem(STORAGE_API_URL_KEY),
      AsyncStorage.getItem(STORAGE_TOKEN_KEY),
    ]);
    if (savedUrl) currentBaseUrl = savedUrl;
    if (savedToken) currentToken = savedToken;
  } catch (e) {
    console.warn('Failed to load saved API/Auth config:', e);
  }
  return { baseUrl: currentBaseUrl, token: currentToken };
};

export const getStoredApiUrl = () => currentBaseUrl;

export const setStoredApiUrl = async (newUrl) => {
  try {
    const cleanUrl = newUrl.replace(/\/+$/, '');
    await AsyncStorage.setItem(STORAGE_API_URL_KEY, cleanUrl);
    currentBaseUrl = cleanUrl;
    return true;
  } catch (e) {
    console.error('Failed to save API URL:', e);
    return false;
  }
};

// Token helpers
export const getAuthToken = () => currentToken;

export const setAuthToken = async (token) => {
  try {
    currentToken = token;
    if (token) {
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  } catch (e) {
    console.error('Failed to store auth token:', e);
  }
};

export const getStoredUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(STORAGE_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = async (user) => {
  try {
    if (user) {
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to store user profile:', e);
  }
};

// Axios Client with dynamic base URL & Authorization Header
const createClient = (endpoint = '/tasks') => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const client = axios.create({
    baseURL: `${currentBaseUrl}${endpoint}`,
    headers,
    timeout: 35000,
  });

  return client;
};

// Auth API Methods
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

  updateProfile: async (data) => {
    const client = createClient('/auth');
    const res = await client.put('/profile', data);
    return res.data;
  },
};

// Tasks API Methods
export const taskApi = {
  // Test connection to any given URL
  testConnection: async (urlToTest) => {
    try {
      const baseUrl = urlToTest ? urlToTest.replace(/\/+$/, '') : currentBaseUrl.replace(/\/+$/, '');
      // Try root or /health with 40s timeout (handles Render cold-starts)
      const res = await axios.get(baseUrl, { timeout: 40000 });
      return { ok: res.status < 400, message: 'Successfully connected to backend!' };
    } catch (e) {
      if (e.response && e.response.status < 500) {
        // Server responded (even with 401/404), meaning it is alive!
        return { ok: true, message: 'Successfully connected to backend!' };
      }
      if (e.code === 'ECONNABORTED' || e.message?.toLowerCase().includes('timeout')) {
        return { ok: false, message: 'Connection timed out. Render server might still be waking up — please retry in a few seconds.' };
      }
      return { ok: false, message: 'Cannot connect to this URL. Check internet or server status.' };
    }
  },

  // Fetch all tasks with optional filters
  getTasks: async (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((k) => {
      if (
        params[k] !== '' &&
        params[k] !== null &&
        params[k] !== undefined &&
        params[k] !== 'all'
      ) {
        cleanParams[k] = params[k];
      }
    });
    const client = createClient('/tasks');
    const res = await client.get('/', { params: cleanParams });
    return res.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const client = createClient('/tasks');
    const res = await client.post('/', taskData);
    return res.data;
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    const client = createClient('/tasks');
    const res = await client.put(`/${id}`, taskData);
    return res.data;
  },

  // Delete a task
  deleteTask: async (id) => {
    const client = createClient('/tasks');
    const res = await client.delete(`/${id}`);
    return res.data;
  },

  // Get productivity stats
  getStats: async () => {
    const client = createClient('/tasks');
    const res = await client.get('/stats/summary');
    return res.data;
  },
};

export default taskApi;
