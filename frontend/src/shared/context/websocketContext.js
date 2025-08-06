import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import notificationService from '../../api/customerPanelServices/notificationService';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, auth, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [personnelStatuses, setPersonnelStatuses] = useState({});
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const webSocketRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (userType === 'customer' && auth?.token) {
      try {
        const data = await notificationService.getMyNotifications();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
  }, [userType, auth?.token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!(auth && auth.token)) {
      if (webSocketRef.current) {
        webSocketRef.current.close(1000, 'User logged out');
      }
      return;
    }

    const connect = () => {
      console.log('[WebSocket] Bağlantı kuruluyor...');
      const ws = new WebSocket(`ws://localhost:3001?token=${auth.token}`);
      webSocketRef.current = ws;
      setConnectionStatus('connecting');

      ws.onopen = () => {
        console.log('[WebSocket] Bağlantı başarılı (onopen tetiklendi).');
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        console.log('[WebSocket] Sunucudan mesaj alındı:', event.data);
        try {
          const message = JSON.parse(event.data);
          setLastMessage({ ...message, id: Date.now() });
          
          switch (message.type) {
            case 'CONNECTION_SUCCESSFUL':
              console.log('Sunucu bağlantıyı onayladı:', message.payload.message);
              break;
            case 'INITIAL_PERSONNEL_STATUS':
              setPersonnelStatuses(prev => {
                const newStatuses = { ...prev };
                message.payload.forEach(p => { newStatuses[p.id] = p.status; });
                return newStatuses;
              });
              break;
            case 'PERSONNEL_STATUS_UPDATE':
              setPersonnelStatuses(prev => ({ ...prev, [message.payload.id]: message.payload.status }));
              break;
            case 'INCOMING_TRANSFER':
            case 'NEW_MESSAGE':
              if (message.newNotification) {
                fetchNotifications();
              }
              break;
            default:
              break;
          }
        } catch (error) {
          console.error('[WebSocket] Mesaj işlenemedi:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`[WebSocket] Bağlantı kapandı. Kod: ${event.code}, Sebep: ${event.reason}`);
        setConnectionStatus('disconnected');
        if (webSocketRef.current && webSocketRef.current.readyState !== WebSocket.CLOSED) {
          setTimeout(connect, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Bir hata oluştu:', error);
        ws.close();
      };
    };

    connect();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close(1000, 'Component unmounting');
        webSocketRef.current = null;
      }
    };
  }, [auth, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (userType !== 'customer') return;
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }, [userType]);

  const value = useMemo(() => ({
    connectionStatus,
    lastMessage,
    notifications,
    unreadCount,
    markAllAsRead,
    personnelStatuses,
  }), [connectionStatus, lastMessage, notifications, unreadCount, markAllAsRead, personnelStatuses]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};