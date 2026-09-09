import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/taskApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('taskflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res && res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('taskflow_user', JSON.stringify(res.user));
          }
        } catch (err) {
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('taskflow_token', res.token);
        localStorage.setItem('taskflow_user', JSON.stringify(res.user));
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authApi.register(name, email, password);
      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('taskflow_token', res.token);
        localStorage.setItem('taskflow_user', JSON.stringify(res.user));
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
