import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage on mount
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!user); // if no cached user, we'll load from server

  // Load current user from backend using token
  const loadUser = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/v1/auth/me'); // backend endpoint to get current user
      const userData = data?.data?.alumni || data?.alumni || data?.user || data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to load user:', err?.response?.status);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Call loadUser on mount if we have a token but no cached user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      loadUser();
    } else if (!token) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // If no user data provided, load from server
      loadUser();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Optionally call backend logout endpoint to invalidate token/session
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loadUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
