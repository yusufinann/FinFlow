import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import notificationService from '../../api/customerPanelServices/notificationService';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children, auth,userType  }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const webSocketRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!auth?.token) return;
    if(userType === 'customer'&&auth?.token) {
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

   
  }, [userType,auth?.token]);

  useEffect(() => {
    if (auth?.token) {
      fetchNotifications();
    }
  }, [auth?.token, fetchNotifications]);

  useEffect(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    if (!(auth && auth.user && auth.token)) {
      if (webSocketRef.current) webSocketRef.current.close(1000, 'User logged out');
      return;
    }

    const connect = () => {
      const ws = new WebSocket(`ws://localhost:3001?token=${auth.token}`);
      webSocketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage({ ...message, id: Date.now() });
          if (message.newNotification === true) {
            fetchNotifications();
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          reconnectTimerRef.current = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (webSocketRef.current) webSocketRef.current.close(1000, 'Component unmounting');
    };
  }, [auth, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }, []);

  const value = {
    connectionStatus,
    lastMessage,
    notifications,
    unreadCount,
    markAllAsRead,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};