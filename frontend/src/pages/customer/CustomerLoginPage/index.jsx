import React, { useState } from 'react';
import {Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Alert,
  Grid,
  Link,
  Avatar,
  CssBaseline,
  Button,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useCustomerAuth } from '../../../shared/context/CustomerAuthContext';

const CustomerLoginPage = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useCustomerAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (!customerNumber || !password) {
      setError('Müşteri numarası ve şifre alanları zorunludur.');
      setIsLoading(false);
      return;
    }

    try {
      await login(customerNumber, password);
    } catch (err) {
      setError(err.message || 'Giriş sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Müşteri Girişi
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="customer_number"
            label="Müşteri Numarası"
            name="customer_number"
            autoComplete="username"
            autoFocus
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
            disabled={isLoading}
            inputProps={{ maxLength: 6 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Giriş Yap'
            )}
          </Button>

          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/customer/forgot-password" variant="body2">
                Şifremi Unuttum
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/customer/initial-password" variant="body2">
                {"İlk Şifremi Oluştur"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CustomerLoginPage;