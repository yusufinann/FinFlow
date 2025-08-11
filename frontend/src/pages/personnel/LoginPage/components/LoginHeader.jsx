// === file: src/components/Login/LoginHeader.js ===
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import TopNavigationBar from '../../../../shared/TopNavigationBar';

const LoginHeader = () => {
  return (
    <>
      <TopNavigationBar />
      <Box sx={{
        backgroundColor: 'white',
        py: 2,
        px: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} component={Link} to="/">
              <Box sx={{
                width: 40,
                height: 40,
                backgroundColor: '#dc143c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography sx={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  🌾
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>
                FINFLOW
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 60,
                height: 60,
                border: '2px solid #ddd',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>0850</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>220</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>00 01</Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                  Müşteri İletişim
                </Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                  Merkezi
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#666' }}>
                  www.finflow.com.tr
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginHeader;