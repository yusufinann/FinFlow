import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { useCustomerAuth } from '../../../shared/context/CustomerAuthContext';
import CustomerLoginForm from './components/CustomerLoginForm';
import CustomerInfoPanel from './components/CustomerInfoPanel';
import TopNavigationBar from '../../../shared/TopNavigationBar';

const CustomerLoginPage = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileLogin, setMobileLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useCustomerAuth();
  const navigate = useNavigate();

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
      // login fonksiyonuna rememberMe parametresini geç
      await login(customerNumber, password, rememberMe);
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.message || 'Giriş sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dc143c 0%, #b91c1c 50%, #991b1b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(0,0,0,0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }} />

      <TopNavigationBar />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 4 }}>
        <Grid container spacing={4} sx={{ minHeight: 'calc(100vh - 120px)' }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CustomerLoginForm
              customerNumber={customerNumber}
              setCustomerNumber={setCustomerNumber}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              mobileLogin={mobileLogin}
              setMobileLogin={setMobileLogin}
              error={error}
              setError={setError}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CustomerInfoPanel />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerLoginPage;