import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRegisterPage } from './useRegisterPage';

const RegisterPage = ({ onShowLogin }) => {
  const {
    firstName, setFirstName,
    lastName, setLastName,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    branchCode, setBranchCode, // YENİ STATE
    error, successMessage, loading, handleRegister,
  } = useRegisterPage(onShowLogin);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      width: { xs: '90vw', md: '25vw' }, p: 4, borderRadius: 2,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', backgroundColor: 'background.paper',
    }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Personel Kaydı
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        Yeni personel hesabı oluşturun.
      </Typography>

      <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          <TextField fullWidth required label="Ad" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
          <TextField fullWidth required label="Soyad" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
          <TextField fullWidth required label="Personel ID / Kullanıcı Adı" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
          
          {/* YENİ ŞUBE KODU ALANI */}
          <TextField
            fullWidth
            required
            label="Şube Kodu"
            variant="outlined"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
            disabled={loading}
          />

          <TextField
            fullWidth required label="Şifre" variant="outlined" type={showPassword ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth required label="Şifreyi Onayla" variant="outlined" type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading || !!successMessage} sx={{ py: 1.5, mt: 2, fontWeight: 'bold', bgcolor: '#E30613', '&:hover': { bgcolor: '#c10511' } }}>
            {loading ? 'Kayıt Olunuyor...' : 'Hesap Oluştur'}
          </Button>

          <Button fullWidth variant="text" size="large" onClick={onShowLogin} disabled={loading}>
            Zaten hesabınız var mı? Giriş Yap
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default RegisterPage;