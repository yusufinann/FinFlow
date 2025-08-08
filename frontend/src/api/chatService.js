import apiClient from './api'; 

const chatService = {
  getContacts: () => {
    return apiClient.get('/chat/contacts');
  },
  
  getChatHistory: (contactId) => {
    return apiClient.get(`/chat/history/${contactId}`);
  },

  markMessagesAsRead: (senderId) => {
    return apiClient.post('/chat/mark-as-read', { senderId });
  }
};

export default chatService;