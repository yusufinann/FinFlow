import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Typography, Divider, Avatar, Badge
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useCustomerAuth } from '../shared/context/CustomerAuthContext';
import { useWebSocket } from '../shared/context/websocketContext';

const drawerWidth = 260;
const ziraatRed = '#E30613';

const pages = [
  { name: 'Hesap Özetim', path: '/customer/dashboard', icon: <AccountBalanceWalletIcon /> },
  { name: 'Para Transferi', path: '/customer/transfer', icon: <SwapHorizIcon /> },
  { name: 'Döviz Kuru', path: '/customer/exchange', icon: <CurrencyExchangeIcon /> },
  { name: 'İşlem Geçmişi', path: '/customer/history', icon: <ReceiptLongIcon /> },
];

const notificationPage = {
  name: 'Bildirimler',
  path: '/customer/notifications',
  icon: <NotificationsIcon />,
};

const CustomerSidebar = () => {
  const { customer, logout } = useCustomerAuth();
  const { unreadCount } = useWebSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const handleProfileNavigation = () => {
    navigate('/customer/profile');
  };

  const drawerContent = (
    <div>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <AccountBalanceIcon sx={{ color: ziraatRed, mr: 1, fontSize: 30 }} />
        <Typography variant="h6" noWrap sx={{ color: ziraatRed, fontFamily: 'monospace', fontWeight: 700 }}>
          FINFLOW
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={page.path}
              selected={location.pathname === page.path}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(227, 6, 19, 0.08)',
                  borderRight: `3px solid ${ziraatRed}`,
                  color: ziraatRed,
                  '& .MuiListItemIcon-root': { color: ziraatRed },
                },
              }}
            >
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to={notificationPage.path}
            selected={location.pathname === notificationPage.path}
            sx={{
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(227, 6, 19, 0.08)',
                borderRight: `3px solid ${ziraatRed}`,
                color: ziraatRed,
                '& .MuiListItemIcon-root': { color: ziraatRed },
              },
            }}
          >
            <ListItemIcon>
              <Badge color="error" badgeContent={unreadCount} max={9}>
                {notificationPage.icon}
              </Badge>
            </ListItemIcon>
            <ListItemText primary={notificationPage.name} />
          </ListItemButton>
        </ListItem>

      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />
        <Box 
          onClick={handleProfileNavigation}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2, 
            p: 1, 
            borderRadius: 1, 
            cursor: 'pointer',
            '&:hover': { bgcolor: 'grey.100' } 
          }}
        >
          <Avatar sx={{ bgcolor: ziraatRed, width: 40, height: 40 }}>
            {customer?.fullName?.[0].toUpperCase()}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {customer?.fullName}
          </Typography>
        </Box>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/customer/settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Ayarlar" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Güvenli Çıkış" />
          </ListItemButton>
        </ListItem>
      </Box>
    </div>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#FFFFFF',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default CustomerSidebar;