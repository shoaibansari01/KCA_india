import api from './api';

export const paymentReceiptService = {
  // Get all school payment receipts
  getPaymentReceipts: async () => {
    const response = await api.get('/get-school-payment-receipts');
    return response.data;
  }
};