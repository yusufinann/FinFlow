import api from './api';

const transactionService = {
  getRecentTransactions: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent transactions:', error.response?.data || error.message);
      throw error;
    }
  },

  getDashboardSummary: async () => {
    try {
      const response = await api.get('/transactions/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error.response?.data || error.message);
      throw error;
    }
  },
  createTransfer:async(transferData) => {
    try {
      const response = await api.post('/transactions/transfer', transferData);
      return response.data;
    } catch (error) {
      console.error('Error creating transfer:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default transactionService;