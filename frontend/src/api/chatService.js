import apiClient from './api'; 

const chatService = {
  getContacts: () => {
    return apiClient.get('/chat/contacts');
  },
  
  getChatHistory: (contactId, page = 1) => {
    return apiClient.get(`/chat/history/${contactId}?page=${page}`);
  },

  markMessagesAsRead: (senderId) => {
    return apiClient.post('/chat/mark-as-read', { senderId });
  }
};

export default chatService;