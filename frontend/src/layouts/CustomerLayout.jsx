import { Box, CssBaseline} from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import customerBackground from '../assets/bg-grey.jpg'; 

const CustomerLayout = () => {
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