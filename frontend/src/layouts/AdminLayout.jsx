// layouts/AdminLayout.jsx (Bu kodda değişiklik yapmaya gerek yok)
import React from 'react';
import { Box } from "@mui/material";
import { Outlet } from 'react-router-dom';
import personnelBackground from '../assets/bg-grey.jpg'; 
import AdminNavbar from '../components/AdminNavbar'; // Admin'e özel navbar

const AdminLayout = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundImage: `url(${personnelBackground})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
    }}>
      <AdminNavbar/>
      <Box
        component="main"
        sx={{
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          p:2
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            mx: { xs: 2, sm: 4, md: 10 }, 
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;