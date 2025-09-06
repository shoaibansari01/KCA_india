import api from './api';

export const authService = {
  // Admin login
  login: async (email, password) => {
    const response = await api.post('/admin-login', {
      userId: email,
      password
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/forgotAdminPass', {
      email
    });
    return response.data;
  },

  // Get current admin user
  getCurrentUser: () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  },

  // Store auth data
  setAuthData: (authData) => {
    localStorage.setItem('admin_token', authData.accessToken);
    localStorage.setItem('admin_user', JSON.stringify(authData.user));
  }
};