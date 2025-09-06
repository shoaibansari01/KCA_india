import api from './api';

export const dashboardService = {
  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.post('/get-dashboard-data');
    return response.data;
  }
};