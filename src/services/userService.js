import api from './api';

export const userService = {
  // Get all users with pagination
  getUsers: async (page = 1, limit = 10, search = '') => {
    const response = await api.post('/get-users', {
      page, 
      limit, 
      search
    });
    return response.data;
  },

  // Restrict/Unrestrict user
  restrictUser: async (userId, isRestricted) => {
    const response = await api.post('/restrictUser', {
      userId,
      isRestricted
    });
    return response.data;
  }
};