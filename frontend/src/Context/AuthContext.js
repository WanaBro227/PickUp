import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../Services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await api.login(email, password);
    if (result.success) {
      const userData = { ...result.user };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return result;
  };

  const register = async (payload) => {
    const result = await api.register(payload);
    if (result.success) {
      const userData = { ...result.user };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false };

    const normalizedUpdates = {
      ...updates,
      addresses: Array.isArray(updates.addresses)
        ? updates.addresses
        : (updates.addresses || '')
            .split(',')
            .map(address => address.trim())
            .filter(Boolean)
    };

    const result = await api.updateProfile(user.id, normalizedUpdates);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  };

  const requestSellerAccess = async (payload) => {
    if (!user) return { success: false };
    const result = await api.createSellerRequest(payload, user.id);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  };

  const refreshUser = async () => {
    if (!user?.id) return null;
    const freshUser = await api.getUserById(user.id);
    if (freshUser) {
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
    }
    return freshUser;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    requestSellerAccess,
    refreshUser,
    isAuthenticated: !!user,
    role: user?.role,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
