import api from './api'; // Axios instance'ınızı import edin

const notificationService = {
  getMyNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking notifications as read:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default notificationService;