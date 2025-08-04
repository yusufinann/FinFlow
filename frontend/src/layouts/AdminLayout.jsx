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
          pt: '64px' // Navbar'ın yüksekliği kadar boşluk bırakmak iyi bir pratiktir.
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            mx: { xs: 2, sm: 4, md: 10 }, // Margin left ve right birleştirildi
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;