import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!user);

  const loadUser = async () => {
    setLoading(true);
    try {
      // Backend /api/v1/auth/me returns the decoded req.user (alumni or student)
      const { data } = await api.get('/api/v1/auth/me');
      const rawUser = data?.data?.alumni || data?.alumni || data?.user || data?.data?.student || data;
      if (rawUser) {
        const role = rawUser.role || (rawUser.registrationNumber ? 'student' : 'alumni');
        const userData = { ...rawUser, role };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Failed to load user:', err?.response?.status);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      loadUser();
    } else if (!token) {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      const role = userData.role || (userData.registrationNumber ? 'student' : 'alumni');
      const formattedUser = { ...userData, role };
      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
    } else {
      loadUser();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isStudent = user?.role === 'student' || Boolean(user?.registrationNumber);
  const isAlumni = user && !isStudent;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loadUser, loading, isStudent, isAlumni }}>
      {children}
    </AuthContext.Provider>
  );
}
