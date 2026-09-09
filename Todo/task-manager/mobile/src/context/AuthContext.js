import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, initApiConfig, setAuthToken, setStoredUser, getStoredUser } from '../api/taskApi';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize Auth state on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const config = await initApiConfig();
        const storedUser = await getStoredUser();

        if (config.token && storedUser) {
          setToken(config.token);
          setUser(storedUser);

          // Verify token in background
          try {
            const meRes = await authApi.getMe();
            if (meRes && meRes.success && meRes.user) {
              setUser(meRes.user);
              await setStoredUser(meRes.user);
            }
          } catch (verifyErr) {
            // Token expired or invalid
            if (verifyErr.response && verifyErr.response.status === 401) {
              await logout();
            }
          }
        }
      } catch (e) {
        console.warn('Auth initialization error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.login(email, password);
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        await setAuthToken(res.token);
        await setStoredUser(res.user);
        return { success: true };
      } else {
        const msg = res.message || 'Login failed';
        setAuthError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Network error during login';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (name, email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.register(name, email, password);
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        await setAuthToken(res.token);
        await setStoredUser(res.user);
        return { success: true };
      } else {
        const msg = res.message || 'Registration failed';
        setAuthError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Network error during registration';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
    await setAuthToken(null);
    await setStoredUser(null);
  };

  // Update user profile info
  const updateProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      if (res && res.success) {
        setUser(res.user);
        await setStoredUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update profile',
      };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
