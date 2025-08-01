import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLoginPage } from '../useLoginPage'; 


const LoginPageRightArea = ({ onShowRegister }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  } = useLoginPage();

  // Şifre görünürlüğünü yöneten state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: '90vw', md: '25vw' },
        p: 4,
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Personel Girişi
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Lütfen bilgilerinizi giriniz.
      </Typography>

      <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            required
            id="username"
            label="Personel ID / Kullanıcı Adı"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            fullWidth
            required
            id="password"
            label="Şifre"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              mt: 2,
              fontWeight: 'bold',
              bgcolor: '#E30613',
              '&:hover': { bgcolor: '#c10511' },
            }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>

          {/* 
            Kayıt Ol butonu. 
            Tıklandığında, parent component'tan gelen onShowRegister fonksiyonunu tetikler.
            Bu da RegisterPage component'inin gösterilmesini sağlar.
          */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={onShowRegister}
            disabled={loading} // Giriş işlemi sırasında bu butonu da pasif yap
            sx={{ py: 1.5 }}
          >
            Kayıt Ol
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPageRightArea;