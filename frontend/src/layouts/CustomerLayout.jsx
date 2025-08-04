import { Box, CircularProgress, CssBaseline} from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import customerBackground from '../assets/bg-grey.jpg'; 
import { useCustomerAuth } from '../shared/context/CustomerAuthContext';

const CustomerLayout = () => {
   const { isLoading } = useCustomerAuth();
    if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        backgroundImage: `url(${customerBackground})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
    }}>
      <CssBaseline />
      <CustomerSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default CustomerLayout;