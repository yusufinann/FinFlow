import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const CustomerInfoPanel = () => {
  return (
    <Paper elevation={0} sx={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 3, p: 4, maxWidth: 400, width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 48, height: 48, backgroundColor: '#dc143c', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
            <Typography sx={{ color: 'white', fontSize: '20px' }}>📱</Typography>
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>Mobil uygulamamız ile</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>FINFLOW hep yanınızda!</Typography>
          </Box>
        </Box>
        <Button variant="outlined" sx={{ borderColor: '#dc143c', color: '#dc143c', borderRadius: '20px', px: 3, '&:hover': { borderColor: '#dc143c', backgroundColor: 'rgba(220, 20, 60, 0.1)' } }}>
          HEMEN YÜKLE
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, mt: 0.5 }}>
            <Typography sx={{ fontSize: '20px' }}>👆</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
            FINFLOW İnternet Şubesi'ne sadece www.finflow.com.tr adresindeki "İnternet Şubesi" linkine tıklayarak ulaşınız
          </Typography>
        </Box>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, mt: 0.5 }}>
            <Typography sx={{ fontSize: '20px' }}>🔒</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
            Müşteri numaranız, İnternet/Mobil bankacılık giriş ve ATM şifrenizi FINFLOW personeli dahil kimse ile paylaşmayınız.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#666', fontSize: '10px', textAlign: 'center' }}>
            🛡️ COMODO<br />SECURE
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 3, p: 2, backgroundColor: 'rgba(220, 20, 60, 0.1)', borderRadius: 2 }}>
        <Typography variant="body2" sx={{ color: '#dc143c', fontWeight: 'bold', mb: 1 }}>
          📞 Müşteri İletişim Merkezi
        </Typography>
        <Typography variant="h6" sx={{ color: '#dc143c', fontWeight: 'bold' }}>
          0850 220 00 01
        </Typography>
        <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
          www.finflow.com.tr
        </Typography>
      </Box>
    </Paper>
  );
};

export default CustomerInfoPanel;