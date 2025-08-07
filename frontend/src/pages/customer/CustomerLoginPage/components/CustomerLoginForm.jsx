// CustomerLoginForm.jsx

import React, { useEffect } from 'react';
import { Link, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Alert,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Paper,
} from '@mui/material';
import RememberedUserCard from './RememberedUserCard'; // Yeni bileşeni import ediyoruz

const CustomerLoginForm = ({
  customerNumber,
  setCustomerNumber,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  mobileLogin,
  setMobileLogin,
  error,
  setError,
  isLoading,
  handleSubmit,
}) => {
  const [rememberedUser, setRememberedUser] = React.useState(null);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('rememberedCustomerInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        setRememberedUser(userInfo);
        setCustomerNumber(userInfo.customerNumber);
        setRememberMe(true);
      } catch (error) {
        console.error('Hatırlanan kullanıcı bilgileri okunamadı:', error);
        localStorage.removeItem('rememberedCustomerInfo');
      }
    }
  }, [setCustomerNumber, setRememberMe]);

  const clearRememberedUser = () => {
    localStorage.removeItem('rememberedCustomerInfo');
    setRememberedUser(null);
    setCustomerNumber('');
    setRememberMe(false);
  };

  return (
    <>
      <Box sx={{ mb: 4, textAlign: 'center' }} component={Link} to="/" style={{ textDecoration: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
            <Typography sx={{ color: '#dc143c', fontSize: '24px', fontWeight: 'bold' }}>Z</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontSize: '28px' }}>
            FINFLOW
          </Typography>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ color: 'white', mb: 4, textAlign: 'center', fontWeight: 500 }}>
        İnternet Şubemize Hoş Geldiniz
      </Typography>

      {rememberedUser && (
        <RememberedUserCard user={rememberedUser} onClear={clearRememberedUser} />
      )}
 {!rememberedUser && (
      <Box sx={{ display: 'flex', mb: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '25px', overflow: 'hidden' }}>
        <Button sx={{ px: 4, py: 1.5, backgroundColor: 'white', color: '#dc143c', fontWeight: 'bold', borderRadius: '25px 0 0 25px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}>
          BİREYSEL
        </Button>
        <Button sx={{ px: 4, py: 1.5, color: 'rgba(255,255,255,0.7)', borderRadius: '0 25px 25px 0', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
          KURUMSAL
        </Button>
      </Box>
 )}
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 400, p: 0, backgroundColor: 'transparent' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {!rememberedUser && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="customer_number"
                placeholder="Müşteri Numaranız"
                name="customer_number"
                autoComplete="username"
                autoFocus
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                disabled={isLoading}
                inputProps={{ maxLength: 11 }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '25px',
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: '2px solid #dc143c' }
                  },
                  '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '16px' }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'white',
                          '& + .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.3)' }
                        }
                      }}
                    />
                  }
                  label={<Typography sx={{ color: 'white', fontSize: '14px' }}>Beni Hatırla</Typography>}
                />
              </Box>
            </>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Şifre"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoFocus={!!rememberedUser}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: '25px',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: '2px solid #dc143c' }
              },
              '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '16px' }
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={mobileLogin}
                  onChange={(e) => setMobileLogin(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'white',
                      '& + .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.3)' }
                    }
                  }}
                />
              }
              label={<Typography sx={{ color: 'white', fontSize: '14px' }}>Mobil İmza İle Giriş</Typography>}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 2,
              mb: 3,
              py: 2,
              backgroundColor: '#2c3e50',
              color: 'white',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              '&:hover': { backgroundColor: '#34495e' },
              '&:disabled': { backgroundColor: 'rgba(44, 62, 80, 0.5)' }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'DEVAM'}
          </Button>

          <Button
            component={RouterLink}
            to="/customer/initial-password"
            fullWidth
            variant="outlined"
            sx={{
              py: 1.5,
              color: 'white',
              borderColor: 'white',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            İLK ŞİFRENİ OLUŞTUR
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default CustomerLoginForm;