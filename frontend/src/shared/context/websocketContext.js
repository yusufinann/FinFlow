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
  
  const webSocketRef = useRef(null);
  const activeChatIdRef = useRef(null);

  const fetchInitialData = useCallback(async () => {
    if (!auth?.token) return;
    if (userType === 'customer') {
      try {
        const data = await notificationService.getMyNotifications();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    } else if (userType === 'admin' || userType === 'personnel') {
      try {
        const { data } = await chatService.getContacts();
        if (data.success) {
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

  useEffect(() => {
    if (!auth?.token) {
      if (webSocketRef.current) webSocketRef.current.close();
      return;
    }

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:3001?token=${auth.token}`);
      webSocketRef.current = ws;
      setConnectionStatus('connecting');

      ws.onopen = () => setConnectionStatus('connected');
      
      ws.onclose = () => setConnectionStatus('disconnected');

      ws.onerror = (error) => {
        console.error('[WebSocket] Hata:', error);
        ws.close();
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'INITIAL_PERSONNEL_STATUS':
            setPersonnelStatuses(prev => {
              const newStatuses = { ...prev };
              message.payload.forEach(p => { newStatuses[p.id] = p; });
              return newStatuses;
            });
            break;
          case 'PERSONNEL_STATUS_UPDATE':
            setPersonnelStatuses(prev => ({ ...prev, [message.payload.id]: message.payload }));
            break;
          case 'INCOMING_TRANSFER':
          case 'NEW_MESSAGE':
            if (message.newNotification && userType === 'customer') fetchInitialData();
            break;
            
          // --- BURASI DÜZELTİLDİ ---
          // Hem göndericinin onayı hem de alıcının yeni mesajı aynı mantıkla çalışır:
          // Gelen mesajı ilgili sohbet dizisine ekle.
          case 'MESSAGE_SENT_CONFIRMATION':
          case 'NEW_CHAT_MESSAGE': {
            const newMessage = message.payload;
            // Sohbet partnerinin ID'sini bul (gönderici veya alıcı olabiliriz)
            const chatPartnerId = newMessage.sender_id === auth.user.id ? newMessage.receiver_id : newMessage.sender_id;
            
            // Gelen mesajı messages state'indeki doğru sohbete ekle
            setMessages(prev => ({
              ...prev,
              [chatPartnerId]: [...(prev[chatPartnerId] || []), newMessage],
            }));
            
            // Sadece ALICIYSAN ve mesaj YENİYSE okunmamış sayısını artır/okundu olarak işaretle
            if (message.type === 'NEW_CHAT_MESSAGE') {
                if (chatPartnerId !== activeChatIdRef.current) {
                    setUnreadMessages(prev => ({
                        ...prev,
                        [chatPartnerId]: (prev[chatPartnerId] || 0) + 1,
                    }));
                } else {
                    // Sohbet penceresi zaten açıksa, mesajı okundu olarak işaretle
                    chatService.markMessagesAsRead(chatPartnerId);
                }
            }
            break;
          }
          // --- DÜZELTME BİTTİ ---

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
    };
    connect();
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close(1000, 'Component unmounting');
        webSocketRef.current = null;
      }
    };
  }, [auth, userType, fetchInitialData]);

  const loadChatHistory = useCallback(async (contactId) => {
    activeChatIdRef.current = contactId;
    try {
        const { data } = await chatService.getChatHistory(contactId);
        if(data.success) {
            setMessages(prev => ({ ...prev, [contactId]: data.messages }));
            if (data.messages.some(m => m.receiver_id === auth.user.id && !m.is_read)) {
                await chatService.markMessagesAsRead(contactId);
            }
            setUnreadMessages(prev => {
                const newUnread = {...prev};
                delete newUnread[contactId];
                return newUnread;
            });
        }
    } catch(error) {
        console.error("Sohbet geçmişi yüklenemedi", error);
    }
  }, [auth?.user?.id]);
  
  const sendMessage = useCallback((receiverId, content) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        const payload = {
            type: 'SEND_CHAT_MESSAGE',
            payload: { receiverId, content }
        };
        webSocketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const value = useMemo(() => ({
    connectionStatus,
    notifications,
    unreadCount,
    personnelStatuses,
    chatContacts,
    messages,
    unreadMessages,
    loadChatHistory,
    sendMessage,
  }), [connectionStatus, notifications, unreadCount, personnelStatuses, chatContacts, messages, unreadMessages, loadChatHistory, sendMessage]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};