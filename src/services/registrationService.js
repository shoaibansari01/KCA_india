import api from './api';

export const registrationService = {
  // Get all registrations (no pagination limit)
  getRegistrations: async (page = 1, limit = null, search = '', formType = '') => {
    const requestData = {
      page, 
      search, 
      formType
    };
    
    // Only include limit if it's specified and not null
    if (limit !== null && limit !== undefined) {
      requestData.limit = limit;
    }
    
    const response = await api.post('/get-registration', requestData);
    return response.data;
  },

  // Get single registration by ID
  getRegistrationById: async (registrationId) => {
    const response = await api.get(`/getSingleRegisterUser/${registrationId}`);
    return response.data;
  }
};