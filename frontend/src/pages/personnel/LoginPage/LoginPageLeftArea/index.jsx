import { Box, Typography } from '@mui/material';
import React from 'react';
import bankingIllustration from '../../../../assets/AnalyticsBro.svg';

const LoginPageLeftArea = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: '90vw', md: '25vw' },
        p: 2,
        boxShadow: 3,
        borderRadius: 2, 
      }}
    >
      <Box
        component="img"
        src={bankingIllustration}
        alt="Secure Banking Illustration"
        sx={{
          width: '100%',
          height: 'auto',
          maxWidth: '400px',
        }}
      />
      <Typography 
        variant="h5" 
        sx={{ 
          mt: 4, 
          fontWeight: 'bold', 
          textAlign: 'center' 
        }}
      >
        FinFlow'a Hoş Geldiniz
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mt: 1, 
          color: 'text.secondary', 
          textAlign: 'center' 
        }}
      >
        Güvenli ve hızlı bankacılık işlemleriniz için giriş yapın.
      </Typography>
    </Box>
  );
};

export default LoginPageLeftArea;