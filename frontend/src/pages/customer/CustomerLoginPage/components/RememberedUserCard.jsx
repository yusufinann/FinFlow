import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Close as CloseIcon } from '@mui/icons-material';

const RememberedUserCard = ({ user, onClear }) => {
  return (
    <Box sx={{
      mb: 1,
      position: 'relative',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: '15px',
      p: 2
    }}>
      <IconButton
        onClick={onClear}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'rgba(255,255,255,0.7)',
          width: 30,
          height: 30,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        <PersonIcon 
          sx={{ 
            fontSize: 50, 
            color: 'white', 
            mb: 1.5,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1.5,
            border: '2px solid rgba(255,255,255,0.3)'
          }} 
        />   

        <Typography sx={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px',
          mb: 0.5
        }}>
          Hoşgeldiniz {user.customerName || 'Müşteri'}
        </Typography>

        <Typography sx={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px'
        }}>
          {user.customerNumber}
        </Typography>
      </Box>
    </Box>
  );
};

export default RememberedUserCard;