import api from './api';
import { MOCK_USERS } from '../data/mockData';

// Simulated delay helper for realistic UX loading states
const mockDelay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Expected Future Backend Endpoint: POST /api/auth/login
  login: async ({ email, password, role = 'student' }) => {
    await mockDelay(300);
    // When backend is ready:
    // const res = await api.post('/auth/login', { email, password, role });
    // return res.data;

    // Frontend Mock Validation
    const userRole = role.toLowerCase();
    const user = MOCK_USERS[userRole] || MOCK_USERS.student;
    
    // Store mock session token
    const mockToken = `mock-jwt-token-${userRole}-${Date.now()}`;
    localStorage.setItem('smartcampus_token', mockToken);
    localStorage.setItem('smartcampus_user', JSON.stringify(user));

    return {
      success: true,
      token: mockToken,
      user,
      message: `Welcome back, ${user.name}!`,
    };
  },

  // Expected Future Backend Endpoint: POST /api/auth/register
  register: async (userData) => {
    await mockDelay(350);
    // When backend is ready:
    // const res = await api.post('/auth/register', userData);
    // return res.data;

    const mockToken = `mock-jwt-token-registered-${Date.now()}`;
    const newUser = {
      ...userData,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };

    localStorage.setItem('smartcampus_token', mockToken);
    localStorage.setItem('smartcampus_user', JSON.stringify(newUser));

    return {
      success: true,
      token: mockToken,
      user: newUser,
      message: 'Registration successful! Welcome to SmartCampus AI.',
    };
  },

  // Expected Future Backend Endpoint: POST /api/auth/forgot-password
  forgotPassword: async (email) => {
    await mockDelay(250);
    // When backend is ready:
    // return api.post('/auth/forgot-password', { email });
    return {
      success: true,
      message: `Password reset link sent to ${email}. Please check your inbox.`,
    };
  },

  logout: async () => {
    localStorage.removeItem('smartcampus_token');
    localStorage.removeItem('smartcampus_user');
    return { success: true };
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('smartcampus_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};

export default authService;
