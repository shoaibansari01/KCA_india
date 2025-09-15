import api from './api';

const certificateService = {
  // Get all sent certificates for admin
  getAllSentCertificates: async () => {
    try {
      const response = await api.get('/admin/get-all-sent-certificates');
      return response.data;
    } catch (error) {
      console.error('Error fetching sent certificates:', error);
      throw error;
    }
  },

  // Get certificates by specific record ID
  getCertificatesByRecord: async (recordId) => {
    try {
      const response = await api.get(`/admin/get-certificates/${recordId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching certificates by record:', error);
      throw error;
    }
  },

  // Send certificates to user (for completeness)
  sendCertificatesToUser: async (formData) => {
    try {
      const response = await api.post('/admin/send-certificates-to-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending certificates to user:', error);
      throw error;
    }
  }
};

export { certificateService };