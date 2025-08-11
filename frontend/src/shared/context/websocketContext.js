import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import notificationService from '../../api/customerPanelServices/notificationService';
import chatService from '../../api/chatService';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, auth, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [personnelStatuses, setPersonnelStatuses] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [chatContacts, setChatContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [lastMessage, setLastMessage] = useState(null);
  const [chatPagination, setChatPagination] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const webSocketRef = useRef(null);
  const activeChatIdRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const fetchInitialData = useCallback(async () => {
    if (!auth?.token) return;
    if (userType === 'customer') {
      try {
        const data = await notificationService.getMyNotifications();
        
        if (data && data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        } else {
            console.warn("Bildirimler alınamadı veya yanıt formatı hatalı:", data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    } else if (userType === 'admin' || userType === 'personnel') {
      try {
        const { data } = await chatService.getContacts();
        if (data && data.success) {
          setChatContacts(data.contacts);
        }
      } catch (error) {
        console.error("Failed to fetch chat contacts:", error);
      }
    }
  }, [userType, auth?.token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const connect = useCallback(() => {
    if (webSocketRef.current && webSocketRef.current.readyState !== WebSocket.CLOSED) return;
    if (!auth?.token) return;

    const ws = new WebSocket(`ws://localhost:3001?token=${auth.token}`);
    webSocketRef.current = ws;
    setConnectionStatus('connecting');

    ws.onopen = () => {
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onclose = (event) => {
      setConnectionStatus('disconnected');
      if (event.code !== 1000) {
        const delay = Math.min(1000 * (2 ** reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('[WebSocket] Hata:', error);
      ws.close();
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLastMessage(message);

      switch (message.type) {
        case 'INITIAL_STAFF_STATUS':
          setPersonnelStatuses(prev => {
            const newStatuses = {};
            message.payload.forEach(p => { newStatuses[p.id] = p; });
            return newStatuses;
          });
          break;
        case 'STAFF_STATUS_UPDATE':
          setPersonnelStatuses(prev => ({ ...prev, [message.payload.id]: message.payload }));
          break;
        case 'INCOMING_TRANSFER':
        case 'NEW_MESSAGE':
          if (message.newNotification && userType === 'customer') fetchInitialData();
          break;
        case 'MESSAGE_SENT_CONFIRMATION':
        case 'NEW_CHAT_MESSAGE': {
          const newMessage = message.payload;
          const chatPartnerId = newMessage.sender_id === auth.user.id ? newMessage.receiver_id : newMessage.sender_id;
          setMessages(prev => ({
            ...prev,
            [chatPartnerId]: [...(prev[chatPartnerId] || []), newMessage],
          }));
          if (message.type === 'NEW_CHAT_MESSAGE') {
            if (chatPartnerId !== activeChatIdRef.current) {
              setUnreadMessages(prev => ({
                ...prev,
                [chatPartnerId]: (prev[chatPartnerId] || 0) + 1,
              }));
            } else {
              chatService.markMessagesAsRead(chatPartnerId);
            }
          }
          break;
        }
        case 'MESSAGES_READ': {
          const { chatPartnerId } = message.payload;
          setMessages(prev => {
            const partnerMessages = prev[chatPartnerId] || [];
            const updatedMessages = partnerMessages.map(msg =>
              msg.sender_id === auth.user.id ? { ...msg, is_read: true } : msg
            );
            return { ...prev, [chatPartnerId]: updatedMessages };
          });
          break;
        }
        default:
          break;
      }
    };
  }, [auth, userType, fetchInitialData]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (webSocketRef.current) webSocketRef.current.close(1000, 'Component unmounting');
    };
  }, [connect]);

  const openChat = useCallback(async (contactId) => {
    activeChatIdRef.current = contactId;
    if (messages[contactId]) {
      if (unreadMessages[contactId] > 0) {
        await chatService.markMessagesAsRead(contactId);
        setUnreadMessages(prev => {
          const newUnread = { ...prev };
          delete newUnread[contactId];
          return newUnread;
        });
      }
      return;
    }

    try {
      const { data } = await chatService.getChatHistory(contactId, 1);
      if (data.success) {
        const chronologicalMessages = data.messages.reverse();
        setMessages(prev => ({ ...prev, [contactId]: chronologicalMessages }));
        setChatPagination(prev => ({ ...prev, [contactId]: data.pagination }));
        
        if (data.messages.some(m => m.receiver_id === auth.user.id && !m.is_read)) {
          await chatService.markMessagesAsRead(contactId);
        }
        setUnreadMessages(prev => {
          const newUnread = { ...prev };
          delete newUnread[contactId];
          return newUnread;
        });
      }
    } catch (error) {
      console.error("Sohbet geçmişi yüklenemedi", error);
    }
  }, [auth?.user?.id, messages, unreadMessages]);

  const loadMoreMessages = useCallback(async (contactId) => {
    const pagination = chatPagination[contactId];
    if (isLoadingMore || !pagination || !pagination.hasNextPage) return;

    setIsLoadingMore(true);
    const SIMULATION_DELAY = 1000;

    try {
      const nextPage = pagination.currentPage + 1;
      
      const apiCallPromise = chatService.getChatHistory(contactId, nextPage);
      const timerPromise = new Promise(resolve => setTimeout(resolve, SIMULATION_DELAY));

      const [apiResponse] = await Promise.all([apiCallPromise, timerPromise]);
      const { data } = apiResponse;
      
      if (data.success && data.messages.length > 0) {
        const chronologicalNewMessages = data.messages.reverse();
        setMessages(prev => ({
          ...prev,
          [contactId]: [...chronologicalNewMessages, ...prev[contactId]],
        }));
        setChatPagination(prev => ({ ...prev, [contactId]: data.pagination }));
      }
    } catch (error) {
      console.error("Daha fazla mesaj yüklenirken hata:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatPagination, isLoadingMore]);

  const sendMessage = useCallback((receiverId, content) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      const payload = { type: 'SEND_CHAT_MESSAGE', payload: { receiverId, content } };
      webSocketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (unreadCount > 0) {
      try {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  }, [unreadCount]);

  const value = useMemo(() => ({
    connectionStatus,
    notifications,
    unreadCount,
    personnelStatuses,
    chatContacts,
    messages,
    unreadMessages,
    lastMessage,
    chatPagination,
    isLoadingMore,
    openChat,
    loadMoreMessages,
    sendMessage,
    markAllAsRead,
    fetchInitialData
  }), [connectionStatus, notifications, unreadCount, personnelStatuses, chatContacts, messages, unreadMessages, lastMessage, chatPagination, isLoadingMore, openChat, loadMoreMessages, sendMessage, markAllAsRead, fetchInitialData]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};