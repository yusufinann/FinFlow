import { Box } from '@mui/material';
import React, { useState } from 'react';
import LoginPageRightArea from './LoginPageRightArea';
import InitialPasswordPage from './LoginPageRightArea/PersonnelInitialPasswordPage';
import ForgotPasswordPage from './LoginPageRightArea/ForgotPasswordPage';

const PersonnelLoginPage = () => {
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [isShowForgotPassword, setIsShowForgotPassword] = useState(false);
  
  const showRegisterView = () => {
    setIsRegisterView(true);
    setIsShowForgotPassword(false);
  };
  
  const showLoginView = () => {
    setIsRegisterView(false);
    setIsShowForgotPassword(false);
  };
  
  const showForgotPassword = () => {
    setIsShowForgotPassword(true);
    setIsRegisterView(false);
  };

  if (isShowForgotPassword) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <ForgotPasswordPage onBackToLogin={showLoginView} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {isRegisterView ? (
        <InitialPasswordPage onShowLogin={showLoginView} />
      ) : (
        <LoginPageRightArea 
          onShowRegister={showRegisterView} 
          onShowForgotPassword={showForgotPassword} 
        />
      )}
    </Box>
  );
};

export default PersonnelLoginPage;