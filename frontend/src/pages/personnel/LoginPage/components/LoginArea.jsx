// === file: src/pages/Login/components/LoginPageRightArea/LoginPageRightArea.js ===
import React from 'react';
import { Box, Grid, Container } from '@mui/material';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginInfoPanel from './LoginInfoPanel';
import { useLoginPage } from './useLoginPage';

const LoginArea = ({ onShowRegister, onShowForgotPassword }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLoginPage();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
   
      <LoginHeader />

      <Box sx={{
        flex: 1,
        background: 'linear-gradient(135deg, #dc143c 0%, #b91c1c 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Grid container sx={{ height: '100%', minHeight: '600px' }}>
            
            <Grid item xs={12} md={7} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4
            }}>
              <LoginForm 
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                error={error}
                loading={loading}
                handleLogin={handleLogin}
                onShowRegister={onShowRegister}
                onShowForgotPassword={onShowForgotPassword}
              />
            </Grid>

            <Grid item xs={12} md={5} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4
            }}>
              <LoginInfoPanel />
            </Grid>

          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginArea;