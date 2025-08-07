// === file: src/components/Login/LoginInfoPanel.js ===
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Paper 
} from '@mui/material';
import { TouchApp, Security } from '@mui/icons-material';

const LoginInfoPanel = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 3,
        p: 4,
        width: '100%',
        maxWidth: '400px',
        mx: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{
          width: 40,
          height: 40,
          backgroundColor: '#dc143c',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2
        }}>
          <Typography sx={{ color: 'white', fontSize: '20px' }}>
            🎯
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Size Özel faiz oranları ile FINFLOW hep yanınızda !
        </Typography>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          py: 1.5,
          mb: 3,
          borderColor: '#dc143c',
          color: '#dc143c',
          borderRadius: '25px',
          fontSize: '12px',
          fontWeight: 'bold',
          '&:hover': {
            borderColor: '#dc143c',
            backgroundColor: 'rgba(220, 20, 60, 0.1)'
          }
        }}
      >
        MEVDUAT TEKLİFİ AL
      </Button>

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <TouchApp sx={{ color: '#dc143c', mt: 0.5 }} />
          <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
            FINFLOW İnternet Şubesi'ne sadece www.finflow.com.tr adresindeki "İnternet Şubesi" linkine tıklayarak ulaşınız
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Security sx={{ color: '#dc143c', mt: 0.5 }} />
          <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
            Müşteri numaranızı, İnternet/Mobil bankacılık giriş ve ATM şifrenizi FINFLOW personeli dahil kimse ile paylaşmayınız.
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Box sx={{
          width: 80,
          height: 40,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: '#666' }}>
            COMODO SECURE
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginInfoPanel;