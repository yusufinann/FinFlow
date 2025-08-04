import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import authService from '../../../../api/authService';

const steps = ['Kimlik Doğrulama', 'Şifre Belirleme'];

const PersonnelInitialPasswordPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    tckn: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authService.requestInitialPasswordOTP(
        formData.username,
        formData.tckn
      );
      if (response.success) {
        setSuccess(response.message);
        setActiveStep(1);
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authService.setInitialPassword(
        formData.username,
        formData.otp,
        formData.newPassword
      );
      if (response.success) {
        setSuccess(response.message + ' Giriş sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => {
          navigate('/personnel-login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          İlk Şifre Belirleme
        </Typography>
        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

        {activeStep === 0 && (
          <Box component="form" onSubmit={handleRequestOTP} sx={{ width: '100%' }}>
            <TextField margin="normal" required fullWidth label="Kullanıcı adı" name="username" value={formData.username} onChange={handleChange} disabled={isLoading} inputProps={{ maxLength: 6 }} />
            <TextField margin="normal" required fullWidth label="T.C. Kimlik Numarası" name="tckn" value={formData.tckn} onChange={handleChange} disabled={isLoading} inputProps={{ maxLength: 11 }} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Doğrulama Kodu Gönder'}
            </Button>
          </Box>
        )}

        {activeStep === 1 && (
          <Box component="form" onSubmit={handleSetPassword} sx={{ width: '100%' }}>
            <TextField margin="normal" required fullWidth label="Doğrulama Kodu (OTP)" name="otp" value={formData.otp} onChange={handleChange} disabled={isLoading} />
            <TextField margin="normal" required fullWidth type="password" label="Yeni Şifre" name="newPassword" value={formData.newPassword} onChange={handleChange} disabled={isLoading} />
            <TextField margin="normal" required fullWidth type="password" label="Yeni Şifre (Tekrar)" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Şifremi Oluştur'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PersonnelInitialPasswordPage;