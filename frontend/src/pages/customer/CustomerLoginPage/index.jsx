import React, { useState } from 'react';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Alert,
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Switch,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useCustomerAuth } from '../../../shared/context/CustomerAuthContext';

const CustomerLoginPage = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileLogin, setMobileLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useCustomerAuth();
const navigate=useNavigate();
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
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(0,0,0,0.1) 0%, transparent 50%)
        `,
        zIndex: 1
      }} />

      {/* Top Navigation */}
      <AppBar position="static" elevation={0} sx={{ 
        backgroundColor: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '48px !important' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
              GÜVENLİK
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
              YARDIM
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
              SIKÇA SORULAN SORULAR
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', fontSize: '13px' }}>
              ENGLISH
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pt: 4 }}>
        <Grid container spacing={4} sx={{ minHeight: 'calc(100vh - 120px)' }}>
          {/* Left Side - Login Form */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* FINFLOW Logo */}
            <Box sx={{ mb: 4, textAlign: 'center' }}component={Link} to="/">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2 
              }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography sx={{ 
                    color: '#dc143c', 
                    fontSize: '24px', 
                    fontWeight: 'bold' 
                  }}>
                    Z
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '28px'
                }}>
                  FINFLOW
                </Typography>
              </Box>
            </Box>

            {/* Welcome Message */}
            <Typography variant="h5" sx={{ 
              color: 'white', 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 500
            }}>
              İnternet Şubemize Hoş Geldiniz
            </Typography>

            {/* Login Tabs */}
            <Box sx={{ 
              display: 'flex', 
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '25px',
              overflow: 'hidden'
            }}>
              <Button
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: 'white',
                  color: '#dc143c',
                  fontWeight: 'bold',
                  borderRadius: '25px 0 0 25px',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                BİREYSEL
              </Button>
              <Button
                sx={{
                  px: 4,
                  py: 1.5,
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: '0 25px 25px 0',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                KURUMSAL
              </Button>
            </Box>

            {/* Login Form */}
            <Paper 
              elevation={0}
              sx={{ 
                width: '100%',
                maxWidth: 400,
                p: 0,
                backgroundColor: 'transparent'
              }}
            >
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

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
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #dc143c'
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '16px 20px',
                      fontSize: '16px'
                    }
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'white',
                            '& + .MuiSwitch-track': {
                              backgroundColor: 'rgba(255,255,255,0.3)'
                            }
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: 'white', fontSize: '14px' }}>
                        Beni Hatırla
                      </Typography>
                    }
                  />
                </Box>

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
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '25px',
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: '2px solid #dc143c'
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '16px 20px',
                      fontSize: '16px'
                    }
                  }}
                />

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mobileLogin}
                        onChange={(e) => setMobileLogin(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'white',
                            '& + .MuiSwitch-track': {
                              backgroundColor: 'rgba(255,255,255,0.3)'
                            }
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: 'white', fontSize: '14px' }}>
                        Mobil İmza İle Giriş
                      </Typography>
                    }
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
                    '&:hover': {
                      backgroundColor: '#34495e'
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(44, 62, 80, 0.5)'
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'DEVAM'
                  )}
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
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  İLK ŞİFRENİ OLUŞTUR
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Side - Info Panel */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 3,
                p: 4,
                maxWidth: 400,
                width: '100%'
              }}
            >
              {/* Mobile App Info */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#dc143c',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Typography sx={{ color: 'white', fontSize: '20px' }}>📱</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Mobil uygulamamız ile
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                      FINFLOW hep yanınızda!
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#dc143c',
                    color: '#dc143c',
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      borderColor: '#dc143c',
                      backgroundColor: 'rgba(220, 20, 60, 0.1)'
                    }
                  }}
                >
                  HEMEN YÜKLE
                </Button>
              </Box>

              {/* Internet Branch Info */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    mt: 0.5
                  }}>
                    <Typography sx={{ fontSize: '20px' }}>👆</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
                    FINFLOW İnternet Şubesi'ne sadece 
                    www.finflow.com.tr adresindeki "İnternet 
                    Şubesi" linkine tıklayarak ulaşınız
                  </Typography>
                </Box>
              </Box>

              {/* Security Info */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    mt: 0.5
                  }}>
                    <Typography sx={{ fontSize: '20px' }}>🔒</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.5 }}>
                    Müşteri numaranız, İnternet/Mobil bankacılık 
                    giriş ve ATM şifrenizi FINFLOW personeli 
                    dahil kimse ile paylaşmayınız.
                  </Typography>
                </Box>
              </Box>

              {/* Security Badge */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mt: 3 
              }}>
                <Box sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography variant="caption" sx={{ 
                    color: '#666',
                    fontSize: '10px',
                    textAlign: 'center'
                  }}>
                    🛡️ COMODO<br />SECURE
                  </Typography>
                </Box>
              </Box>

              {/* Customer Service */}
              <Box sx={{ 
                textAlign: 'center', 
                mt: 3,
                p: 2,
                backgroundColor: 'rgba(220, 20, 60, 0.1)',
                borderRadius: 2
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#dc143c',
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  📞 Müşteri İletişim Merkezi
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: '#dc143c',
                  fontWeight: 'bold'
                }}>
                  0850 220 00 00
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: '#666',
                  display: 'block',
                  mt: 1
                }}>
                  www.finflow.com.tr
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerLoginPage;