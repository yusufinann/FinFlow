import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  error,
  loading,
  handleLogin,
  onShowRegister,
  onShowForgotPassword
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPersonal, setIsPersonal] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', px: 2 }}>
      <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        İnternet Şubemize Hoş Geldiniz
      </Typography>

      <Box sx={{ display: 'flex', mb: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
        <Button
          variant={!isPersonal ? "contained" : "text"}
          onClick={() => setIsPersonal(false)}
          sx={{
            flex: 1, py: 1.5, color: !isPersonal ? '#dc143c' : 'white',
            backgroundColor: !isPersonal ? 'white' : 'transparent',
            borderRadius: '8px 0 0 8px', fontWeight: 'bold',
            '&:hover': { backgroundColor: !isPersonal ? 'white' : 'rgba(255,255,255,0.1)' }
          }}
        >
          KURUMSAL
        </Button>
        <Button
          variant={isPersonal ? "contained" : "text"}
          onClick={() => setIsPersonal(true)}
          disabled
          sx={{
            flex: 1, py: 1.5, color: isPersonal ? '#dc143c' : 'rgba(255,255,255,0.7)',
            backgroundColor: isPersonal ? 'white' : 'transparent',
            borderRadius: '0 8px 8px 0', fontWeight: 'bold',
            '&:hover': { backgroundColor: isPersonal ? 'white' : 'rgba(255,255,255,0.1)' }
          }}
        >
          BİREYSEL
        </Button>
      </Box>

      <Box component="form" onSubmit={handleLogin}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth required placeholder="Kullanıcı Adınız" variant="outlined"
            value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white', borderRadius: '25px',
                '& fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: '2px solid #dc143c' }
              },
              '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'white' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'white' },
                  }}
                />
              }
              label={<Typography sx={{ color: 'white', fontSize: '14px' }}>Beni Hatırla</Typography>}
            />
          </Box>
          <TextField
            fullWidth required placeholder="Şifre" variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white', borderRadius: '25px',
                '& fieldset': { border: 'none' },
                '&.Mui-focused fieldset': { border: '2px solid #dc143c' }
              },
              '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit" fullWidth variant="contained" size="large" disabled={loading}
            sx={{
              py: 2, fontWeight: 'bold', backgroundColor: '#2c3e50', borderRadius: '25px',
              fontSize: '16px', color: 'white', '&:hover': { backgroundColor: '#1a252f' },
              '&:disabled': { backgroundColor: 'rgba(44, 62, 80, 0.5)' }
            }}
          >
            {loading ? 'GİRİŞ YAPILIYOR...' : 'DEVAM'}
          </Button>
          <Button
            type="button" fullWidth variant="outlined" size="large"
            onClick={() => onShowRegister(true)}
            sx={{
              py: 2, fontWeight: 'bold', borderRadius: '25px', fontSize: '16px',
              backgroundColor: '#585f65ff', color: 'white', '&:hover': { backgroundColor: '#1a252f' },
              '&:disabled': { backgroundColor: 'rgba(44, 62, 80, 0.5)' }
            }}
          >
            İlk Şifreni Belirle
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="text" onClick={() => onShowRegister(true)}
              sx={{
                color: 'white', fontSize: '12px', textDecoration: 'underline',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              İlk Şifreni Belirle
            </Button>
            <Button
              variant="text" onClick={() => onShowForgotPassword(true)}
              sx={{
                color: 'white', fontSize: '12px', textDecoration: 'underline',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Şifremi Unuttum
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginForm;