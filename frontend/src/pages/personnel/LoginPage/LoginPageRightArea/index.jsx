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
  Paper,
  Switch,
  FormControlLabel,
  Grid,
  Container
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  TouchApp, 
  Security 
} from '@mui/icons-material';
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

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPersonal, setIsPersonal] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navigation */}
      <Box sx={{
        backgroundColor: '#dc143c',
        py: 1,
        px: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 3,
          maxWidth: '1200px',
          mx: 'auto'
        }}>
          <Typography variant="body2" sx={{ 
            color: 'white', 
            fontSize: '12px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}>
            GÜVENLİK
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'white', 
            fontSize: '12px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}>
            YARDIM
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'white', 
            fontSize: '12px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}>
            SIKÇA SORULAN SORULAR
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'white', 
            fontSize: '12px',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}>
            ENGLISH
          </Typography>
        </Box>
      </Box>

      {/* Header with Logo */}
      <Box sx={{
        backgroundColor: 'white',
        py: 2,
        px: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                width: 40,
                height: 40,
                backgroundColor: '#dc143c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: '24px', 
                  fontWeight: 'bold' 
                }}>
                  🌾
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ 
                color: '#333', 
                fontWeight: 'bold'
              }}>
                FINFLOW
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 60,
                height: 60,
                border: '2px solid #ddd',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>0850</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>220</Typography>
                <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>00 00</Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                  Müşteri İletişim
                </Typography>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                  Merkezi
                </Typography>
                <Typography sx={{ fontSize: '10px', color: '#666' }}>
                  www.finflow.com.tr
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        background: 'linear-gradient(135deg, #dc143c 0%, #b91c1c 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Grid container sx={{ height: '100%', minHeight: '600px' }}>
            {/* Left Side - Login Form */}
            <Grid item xs={12} md={7} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4
            }}>
              <Box sx={{ width: '100%', maxWidth: '500px', px: 2 }}>
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  mb: 4,
                  textAlign: 'center'
                }}>
                  İnternet Şubemize Hoş Geldiniz
                </Typography>

                {/* Tab Buttons */}
                <Box sx={{ display: 'flex', mb: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <Button
                    variant={!isPersonal ? "contained" : "text"}
                    onClick={() => setIsPersonal(false)}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      color: !isPersonal ? '#dc143c' : 'white',
                      backgroundColor: !isPersonal ? 'white' : 'transparent',
                      borderRadius: '8px 0 0 8px',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: !isPersonal ? 'white' : 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    KURUMSAL
                  </Button>
                  <Button
                    variant={isPersonal ? "contained" : "text"}
                    onClick={() => setIsPersonal(true)}
                    disabled
                    sx={{
                      flex: 1,
                      py: 1.5,
                      color: isPersonal ? '#dc143c' : 'rgba(255,255,255,0.7)',
                      backgroundColor: isPersonal ? 'white' : 'transparent',
                      borderRadius: '0 8px 8px 0',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: isPersonal ? 'white' : 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    BİREYSEL
                  </Button>
                </Box>

                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={2}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                      fullWidth
                      required
                      placeholder="Kurumsal Müşteri Numaranız"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '25px',
                          '& fieldset': {
                            border: 'none'
                          },
                          '&.Mui-focused fieldset': {
                            border: '2px solid #dc143c'
                          }
                        },
                        '& .MuiInputBase-input': {
                          padding: '16px 20px',
                          fontSize: '14px'
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: 'white',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'white',
                              },
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
                      fullWidth
                      required
                      placeholder="Şifre"
                      variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '25px',
                          '& fieldset': {
                            border: 'none'
                          },
                          '&.Mui-focused fieldset': {
                            border: '2px solid #dc143c'
                          }
                        },
                        '& .MuiInputBase-input': {
                          padding: '16px 20px',
                          fontSize: '14px'
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
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
                        py: 2,
                        fontWeight: 'bold',
                        backgroundColor: '#2c3e50',
                        borderRadius: '25px',
                        fontSize: '16px',
                        color: 'white',
                        '&:hover': { 
                          backgroundColor: '#1a252f' 
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(44, 62, 80, 0.5)'
                        }
                      }}
                    >
                      {loading ? 'GİRİŞ YAPILIYOR...' : 'DEVAM'}
                    </Button>

   <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      size="large"
                        onClick={()=>onShowRegister(true)}
                      sx={{
                        py: 2,
                        fontWeight: 'bold',
                        borderRadius: '25px',
                        fontSize: '16px',
                        backgroundColor: '#585f65ff' ,
                        color: 'white',
                        '&:hover': { 
                          backgroundColor: '#1a252f' 
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(44, 62, 80, 0.5)'
                        }
                      }}
                    >
                      ilk Şifreni belirle
                    </Button>
                  

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button
                        variant="text"
                        onClick={()=>onShowRegister(true)}
                        sx={{ 
                          color: 'white',
                          fontSize: '12px',
                          textDecoration: 'underline',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                         ilk Şifreni belirle
                      </Button>
                      <Button
                        variant="text"
                        sx={{ 
                          color: 'white',
                          fontSize: '12px',
                          textDecoration: 'underline',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                          }
                        }}
                      >
                        Şifremi Unuttum
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Information Panel */}
            <Grid item xs={12} md={5} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4
            }}>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                  p: 4,
                  width: '100%',
                  maxWidth: '400px',
                  mx: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#dc143c',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    <Typography sx={{ color: 'white', fontSize: '20px' }}>
                      🎯
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Size Özel faiz oranları ile FINFLOW hep yanınızda !
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    py: 1.5,
                    mb: 3,
                    borderColor: '#dc143c',
                    color: '#dc143c',
                    borderRadius: '25px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#dc143c',
                      backgroundColor: 'rgba(220, 20, 60, 0.1)'
                    }
                  }}
                >
                  MEVDUAT TEKLİFİ AL
                </Button>

                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <TouchApp sx={{ color: '#dc143c', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                      FINFLOW İnternet Şubesi'ne sadece www.finflow.com.tr adresindeki "İnternet Şubesi" linkine tıklayarak ulaşınız
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Security sx={{ color: '#dc143c', mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                      Müşteri numaranızı, İnternet/Mobil bankacılık giriş ve ATM şifrenizi FINFLOW personeli dahil kimse ile paylaşmayınız.
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mt: 4
                }}>
                  <Box sx={{
                    width: 80,
                    height: 40,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography sx={{ 
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#666'
                    }}>
                      COMODO SECURE
                    </Typography>
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

export default LoginPageRightArea;