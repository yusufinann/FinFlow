import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Paper,
  Grid,
  Container,
  Stepper,
  Step,
  StepLabel,
  CircularProgress
} from '@mui/material';
import {
  TouchApp,
  Security,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';

const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [tckn, setTcKimlikNo] = useState('');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const steps = ['Kimlik Doğrulama', 'Kod Doğrulama', 'Yeni Şifre'];

  const handleRequestReset = async () => {
    if (!username || !tckn || !email) {
      setError('Lütfen tüm alanları doldurunuz.');
      return false;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, tckn, email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Bir hata oluştu.');
      }
      setSuccess(data.message);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setError('');
    setSuccess('');
    
    if (step === 0) {
      const success = await handleRequestReset();
      if (success) {
        setStep(1);
      }
    } else if (step === 1) {
      if (!resetCode) {
        setError('Lütfen doğrulama kodunu giriniz.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/auth/forgot-password/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, resetCode }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Kod doğrulanamadı.');
        }
        setResetToken(data.resetToken);
        setStep(2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      if (!newPassword || !confirmPassword) {
        setError('Lütfen tüm alanları doldurunuz.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        return;
      }
      if (newPassword.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/auth/forgot-password/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword, resetToken }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Şifre sıfırlanamadı.');
        }
        setStep(3);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    await handleRequestReset();
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
              Kimliğinizi Doğrulayın
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Kullanıcı Adınız"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '25px', '& fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid #dc143c' }}, '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }}}
            />
            <TextField
              fullWidth
              required
              placeholder="TC Kimlik Numaranız"
              variant="outlined"
              value={tckn}
              onChange={(e) => setTcKimlikNo(e.target.value)}
              disabled={loading}
              inputProps={{ maxLength: 11 }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '25px', '& fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid #dc143c' }}, '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }}}
            />
            <TextField
              fullWidth
              required
              placeholder="E-posta Adresiniz"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '25px', '& fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid #dc143c' }}, '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }}}
            />
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
              E-posta Doğrulama
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              {email} adresinize gönderilen 6 haneli doğrulama kodunu giriniz. Kod 3 dakika geçerlidir.
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Doğrulama Kodu"
              variant="outlined"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              disabled={loading}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '18px', letterSpacing: '4px' } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '25px', '& fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid #dc143c' }}, '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '18px' }}}
            />
            <Button
              variant="text"
              onClick={handleResendCode}
              disabled={loading}
              sx={{ color: 'white', fontSize: '12px', textDecoration: 'underline', alignSelf: 'center', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }}}
            >
              Kodu Tekrar Gönder
            </Button>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
              Yeni Şifrenizi Belirleyin
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Yeni Şifre"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '25px', '& fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid #dc143c' }}, '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }}}
            />
            <TextField
              fullWidth
              required
              placeholder="Yeni Şifre Tekrar"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '25px', '& fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid #dc143c' }}, '& .MuiInputBase-input': { padding: '16px 20px', fontSize: '14px' }}}
            />
            <Typography variant="body2" sx={{ color: 'white', fontSize: '12px', textAlign: 'center' }}>
              • Şifreniz en az 6 karakter olmalıdır
            </Typography>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={3} alignItems="center">
            <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
              Şifreniz Başarıyla Değiştirildi
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              Yeni şifrenizle giriş yapabilirsiniz.
            </Typography>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ backgroundColor: '#dc143c', py: 1, px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3, maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }}}>GÜVENLİK</Typography>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }}}>YARDIM</Typography>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }}}>SIKÇA SORULAN SORULAR</Typography>
          <Typography variant="body2" sx={{ color: 'white', fontSize: '12px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }}}>ENGLISH</Typography>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: 'white', py: 2, px: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 40, height: 40, backgroundColor: '#dc143c', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                <Typography sx={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>🌾</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>FINFLOW</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 60, height: 60, border: '2px solid #ddd', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>0850</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>220</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>00 00</Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Müşteri İletişim</Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Merkezi</Typography>
                <Typography sx={{ fontSize: '10px', color: '#666' }}>www.finflow.com.tr</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ flex: 1, background: 'linear-gradient(135deg, #dc143c 0%, #b91c1c 100%)', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Grid container sx={{ height: '100%', minHeight: '600px' }}>
            <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <Box sx={{ width: '100%', maxWidth: '500px', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Button onClick={onBackToLogin} sx={{ color: 'white', minWidth: 'auto', p: 1, mr: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }}}>
                    <ArrowBack />
                  </Button>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>Şifremi Unuttum</Typography>
                </Box>

                {step < 3 && (
                  <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={step} sx={{ mb: 3 }}>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'white' }, '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiStepIcon-root.Mui-active': { color: 'white' }, '& .MuiStepIcon-root.Mui-completed': { color: 'white' }}}>
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                )}

                <Box>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                  
                  {renderStepContent()}

                  {step < 3 && (
                    <Button fullWidth variant="contained" size="large" onClick={handleNext} disabled={loading} sx={{ py: 2, mt: 3, fontWeight: 'bold', backgroundColor: '#2c3e50', borderRadius: '25px', fontSize: '16px', color: 'white', '&:hover': { backgroundColor: '#1a252f' }, '&:disabled': { backgroundColor: 'rgba(44, 62, 80, 0.5)' }}}>
                      {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : step === 2 ? 'ŞİFREYİ DEĞİŞTİR' : 'DEVAM'}
                    </Button>
                  )}

                  {step === 3 && (
                    <Button fullWidth variant="contained" size="large" onClick={onBackToLogin} sx={{ py: 2, mt: 3, fontWeight: 'bold', backgroundColor: '#2c3e50', borderRadius: '25px', fontSize: '16px', color: 'white', '&:hover': { backgroundColor: '#1a252f' }}}>
                      GİRİŞ SAYFASINA DÖN
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <Paper elevation={0} sx={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 3, p: 4, width: '100%', maxWidth: '400px', mx: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, backgroundColor: '#dc143c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    <Typography sx={{ color: 'white', fontSize: '20px' }}>🔒</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Güvenlik Bilgilendirmesi</Typography>
                </Box>
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <TouchApp sx={{ color: '#dc143c', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                      Şifre sıfırlama işlemi sadece kayıtlı e-posta adresinize gönderilen kod ile yapılabilir.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Security sx={{ color: '#dc143c', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                      Şifrenizi FINFLOW personeli dahil kimse ile paylaşmayınız. Güvenliğiniz için düzenli olarak şifrenizi değiştiriniz.
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Box sx={{ width: 80, height: 40, backgroundColor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: '#666' }}>COMODO SECURE</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;