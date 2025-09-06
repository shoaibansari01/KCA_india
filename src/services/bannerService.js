import api from './api';

export const bannerService = {
  // Get all banners
  getBanners: async () => {
    const response = await api.post('/get-banner');
    return response.data;
  },

  // Upload new banner
  uploadBanner: async (formData) => {
    const response = await api.post('/uploadBanner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  // Update banner
  updateBanner: async (bannerId, formData) => {
    const response = await api.post('/updateBanner', {
      bannerId,
      ...formData
    });
    return response.data;
  },

  // Delete banner
  deleteBanner: async (bannerId) => {
    const response = await api.post('/deleteBanner', {
      bannerId
    });
    return response.data;
  }
};