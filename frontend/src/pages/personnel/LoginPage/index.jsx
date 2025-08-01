import { Box } from '@mui/material';
import React, { useState } from 'react';
import LoginPageLeftArea from './LoginPageLeftArea';
import LoginPageRightArea from './LoginPageRightArea';
import RegisterPage from './LoginPageRightArea/RegisterPage';

const PersonnelLoginPage = () => {
  const [isRegisterView, setIsRegisterView] = useState(false);

  const showRegisterView = () => setIsRegisterView(true);

  const showLoginView = () => setIsRegisterView(false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          borderRadius: 2,
          height: 'auto', 
          minHeight: '70vh'
        }}
      >
        <LoginPageLeftArea />

        {isRegisterView ? (
          <RegisterPage onShowLogin={showLoginView} />
        ) : (
          <LoginPageRightArea onShowRegister={showRegisterView} />
        )}
      </Box>
    </Box>
  );
};

export default PersonnelLoginPage;