import api from './api';

export const allRounderCertificateService = {
  // Send Best Performance certificates to users
  sendBestPerformanceCertificates: async (participantData, certificateFiles) => {
    const formData = new FormData();
    
    // Add participant data
    formData.append('participantData', JSON.stringify(participantData));
    
    // Add certificate files
    if (Array.isArray(certificateFiles)) {
      certificateFiles.forEach((file, index) => {
        formData.append('certificates', file);
      });
    } else {
      formData.append('certificates', certificateFiles);
    }
    
    const response = await api.post('/admin/send-best-performance-certificates-to-user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get user's Best Performance certificates
  getUserBestPerformanceCertificates: async () => {
    const response = await api.get('/get-user-best-performance-certificates');
    return response.data;
  },

  // Get user's Best Performance certificates by record ID
  getUserBestPerformanceCertificatesByRecord: async (recordId) => {
    const response = await api.get(`/get-best-performance-certificates-by-record/${recordId}`);
    return response.data;
  },

  // Admin: Get all Best Performance certificates
  getAdminBestPerformanceCertificates: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/admin/get-all-best-performance-certificates', {
      params: { page, limit, search }
    });
    return response.data;
  },

  // Admin: Get Best Performance certificates by record ID
  getAdminBestPerformanceCertificatesByRecord: async (recordId) => {
    const response = await api.get(`/admin/get-best-performance-certificates/${recordId}`);
    return response.data;
  },

  // Admin: Get Best Performance certificates statistics
  getAdminBestPerformanceCertificatesStats: async () => {
    const response = await api.get('/admin/get-best-performance-certificates-stats');
    return response.data;
  }
};