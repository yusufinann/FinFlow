import { Box } from '@mui/material';
import React, { useState } from 'react';
import LoginPageRightArea from './LoginPageRightArea';
import InitialPasswordPage from './LoginPageRightArea/PersonnelInitialPasswordPage';

const PersonnelLoginPage = () => {
  const [isRegisterView, setIsRegisterView] = useState(false);

  const showRegisterView = () => setIsRegisterView(true);
  const showLoginView = () => setIsRegisterView(false);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {isRegisterView ? (
        <InitialPasswordPage onShowLogin={showLoginView} />
      ) : (
        <LoginPageRightArea onShowRegister={showRegisterView} />
      )}
    </Box>
  );
};

export default PersonnelLoginPage;