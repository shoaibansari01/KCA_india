import api from './api';

export const paymentService = {
  // Get all payments with pagination
  getPayments: async (page = 1, limit = 10, search = '', status = '') => {
    const response = await api.post('/get-payment', {
      page, 
      limit, 
      search, 
      status
    });
    return response.data;
  },

  // Get payment details by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/getPayment/${paymentId}`);
    return response.data;
  },

  // Get school payment receipts
  getSchoolPaymentReceipts: async () => {
    const response = await api.get('/get-school-payment-receipts');
    return response.data;
  },

  // Get All-Rounder payment receipts
  getAllRounderPaymentReceipts: async () => {
    const response = await api.get('/get-allrounder-payment-receipts');
    return response.data;
  }
};