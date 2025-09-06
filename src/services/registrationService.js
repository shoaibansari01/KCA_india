import api from './api';

export const registrationService = {
  // Get all registrations with pagination
  getRegistrations: async (page = 1, limit = 10, search = '', formType = '') => {
    const response = await api.post('/get-registration', {
      page, 
      limit, 
      search, 
      formType
    });
    return response.data;
  },

  // Get single registration by ID
  getRegistrationById: async (registrationId) => {
    const response = await api.get(`/getSingleRegisterUser/${registrationId}`);
    return response.data;
  }
};