import React, { useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Paper, CircularProgress, Fade, Avatar, Chip } from '@mui/material';
import { useWebSocket } from '../../../shared/context/websocketContext';

// İkonlar
import {
  Notifications as NotificationsIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  MarkChatReadOutlined as MarkChatReadOutlinedIcon
} from '@mui/icons-material';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAllAsRead, connectionStatus } = useWebSocket();
  
  // Sayfa görüntülendiğinde, okunmamış bildirimler varsa,
  // bunları bir süre sonra okundu olarak işaretle.
  // Bu, kullanıcının yeni bildirimleri görmesine fırsat tanır.
  useEffect(() => {
    if (unreadCount > 0) {
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 2000); // 2 saniye bekleme süresi
      
      return () => clearTimeout(timer);
    }
  }, [unreadCount, markAllAsRead]);

  // Bildirim tipine göre ikon ve renk döndüren yardımcı fonksiyon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TRANSFER_RECEIVED':
      case 'INCOMING_TRANSFER':
        return {
          icon: <ArrowDownwardIcon />,
          color: 'success.main', // Yeşil renk
        };
      case 'TRANSFER_SENT':
        return {
          icon: <ArrowUpwardIcon />,
          color: 'warning.main', // Turuncu/Sarı renk
        };
      default:
        return {
          icon: <NotificationsIcon />,
          color: 'primary.main', // Ana tema rengi
        };
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Bildirimler
          </Typography>
          {unreadCount > 0 && (
            <Chip 
              label={`${unreadCount} Yeni`} 
              color="primary" 
              size="small" 
              sx={{ fontWeight: 'bold' }} 
            />
          )}
        </Box>
        
        <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          {connectionStatus === 'connecting' && notifications.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6, minHeight: '300px' }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6, minHeight: '300px', textAlign: 'center' }}>
              <MarkChatReadOutlinedIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Tüm bildirimler güncel!
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Görüntülenecek yeni bir bildiriminiz bulunmuyor.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((n, index) => {
                const { icon, color } = getNotificationIcon(n.type);
                return (
                  <React.Fragment key={n.notification_id}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 3,
                        position: 'relative',
                        transition: 'background-color 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                      }}
                    >
                      {!n.is_read && (
                        <Box 
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '70%',
                            backgroundColor: 'primary.main',
                            borderRadius: '0 4px 4px 0',
                          }}
                        />
                      )}
                      <Avatar sx={{ bgcolor: color, mr: 2 }}>
                        {icon}
                      </Avatar>
                      <ListItemText
                        primary={n.message}
                        secondary={new Date(n.created_at).toLocaleString('tr-TR', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                        primaryTypographyProps={{ 
                          fontWeight: n.is_read ? 'normal' : 'bold',
                          fontSize: '0.95rem' 
                        }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                    {index < notifications.length - 1 && <Divider component="li" variant="inset" />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Paper>
      </Box>
    </Fade>
  );
};

export default NotificationsPage;