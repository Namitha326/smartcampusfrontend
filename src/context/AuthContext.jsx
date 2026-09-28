import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from '../data/mockData';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check localStorage for existing session, fallback to default student demo user
  const [user, setUser] = useState(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) return savedUser;
    // Default to student for instant seamless preview
    return MOCK_USERS.student;
  });

  const [role, setRole] = useState(() => {
    const savedUser = authService.getCurrentUser();
    return savedUser?.role || 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('smartcampus_token');
    return Boolean(token || true); // initialized active for effortless exploration
  });

  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);

  // Toast Notification System
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const login = async (email, password, selectedRole) => {
    try {
      const res = await authService.login({ email, password, role: selectedRole });
      setUser(res.user);
      setRole(res.user.role);
      setIsAuthenticated(true);
      addToast(`Logged in successfully as ${res.user.name} (${res.user.role})`, 'success');
      return { success: true, role: res.user.role };
    } catch (err) {
      addToast(err.message || 'Login failed. Please check your credentials.', 'error');
      return { success: false, error: err };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const res = await authService.register(formData);
      setUser(res.user);
      setRole(res.user.role);
      setIsAuthenticated(true);
      addToast('Registration complete! Welcome to SmartCampus AI.', 'success');
      return { success: true, role: res.user.role };
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
      return { success: false, error: err };
    }
  };

  // Logout handler
  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setRole('student');
    addToast('You have been logged out.', 'info');
  };

  // Fast Role Switcher (Essential for hackathon live judging & testing all 3 roles!)
  const switchRole = (newRole) => {
    const targetUser = MOCK_USERS[newRole] || MOCK_USERS.student;
    setUser(targetUser);
    setRole(newRole);
    setIsAuthenticated(true);
    localStorage.setItem('smartcampus_user', JSON.stringify(targetUser));
    localStorage.setItem('smartcampus_token', `mock-token-${newRole}`);
    addToast(`Switched active view to ${targetUser.role.toUpperCase()}: ${targetUser.name}`, 'info');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('smartcampus_user', JSON.stringify(updated));
      return updated;
    });
    addToast('Profile updated successfully!', 'success');
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('All notifications marked as read', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        updateUser,
        toasts,
        addToast,
        removeToast,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
