import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert, InputAdornment, Paper, Card, CardContent, Stepper, Step, StepLabel,
  Fade, Slide, Avatar, Chip, IconButton, Divider, Stack
} from '@mui/material';
import {
  Send as SendIcon, AccountCircle as AccountCircleIcon, AccountBalance as AccountBalanceIcon,
  Person as PersonIcon, Euro as EuroIcon, Description as DescriptionIcon, SwapHoriz as SwapHorizIcon,
  CheckCircle as CheckCircleIcon, Warning as WarningIcon, Info as InfoIcon, Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import accountService from '../../../api/customerPanelServices/accountService';
import { useWebSocket } from '../../../shared/context/websocketContext';
import transactionService from '../../../api/customerPanelServices/transactionService';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    backdropFilter: 'blur(10px)',
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  '&.Mui-focused': {
    backgroundColor: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '16px 32px',
  fontSize: '16px',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
  },
  '&:disabled': {
    background: 'linear-gradient(45deg, #ccc 30%, #999 90%)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

const TransactionPage = () => {
  const [myAccounts, setMyAccounts] = useState([]);
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destinationIban, setDestinationIban] = useState('');
  const [destinationFullName, setDestinationFullName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const { lastMessage } = useWebSocket();
  const steps = ['Hesap Seçimi', 'Alıcı Bilgileri', 'Tutar & Açıklama', 'Onay'];

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getMyAccounts();
        if (data.success && data.accounts) setMyAccounts(data.accounts);
      } catch (err) {
        setError('Hesaplarınız yüklenirken bir hata oluştu.');
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (lastMessage && (lastMessage.type === 'TRANSFER_SENT' || lastMessage.type === 'TRANSFER_RECEIVED')) {
      setSuccess(`Anlık Bildirim: ${lastMessage.message}`);
      const timer = setTimeout(() => setSuccess(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (sourceAccountId && activeStep === 0) setActiveStep(1);
    if (destinationIban && destinationFullName && activeStep === 1) setActiveStep(2);
    if (amount && activeStep === 2) setActiveStep(3);
  }, [sourceAccountId, destinationIban, destinationFullName, amount, activeStep]);

  const resetForm = useCallback(() => {
    setSourceAccountId('');
    setDestinationIban('');
    setDestinationFullName('');
    setAmount('');
    setDescription('');
    setActiveStep(0);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (parseFloat(amount) <= 0) {
      setError("Tutar 0'dan büyük olmalıdır.");
      setLoading(false);
      return;
    }
    try {
      const transferData = { sourceAccountId, destinationIban, destinationFullName, amount: parseFloat(amount), description };
      const response = await transactionService.createTransfer(transferData);
      if (response.success) {
        setSuccess(response.message);
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const selectedAccount = myAccounts.find(acc => acc.account_id === sourceAccountId);

  return (
    <Box sx={{ minHeight: '100%'}}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Slide direction="down" in={true} timeout={1200}>
            <GlassCard sx={{ p: { xs: 1, md: 2 } }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel StepIconProps={{ style: { color: index <= activeStep ? '#667eea' : '#ccc' } }}>
                      <Typography variant="body2" color={index <= activeStep ? 'primary' : 'text.secondary'}>{label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </GlassCard>
          </Slide>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: { xs: 1, md: 7 } }}>
              <Slide direction="right" in={true} timeout={1000}>
                <GlassCard sx={{ p: { xs: 1, md: 2 } }}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      {error && <Fade in={!!error}><Alert severity="error" icon={<WarningIcon />} sx={{ borderRadius: '12px' }}>{error}</Alert></Fade>}
                      {success && <Fade in={!!success}><Alert severity="success" icon={<CheckCircleIcon />} sx={{ borderRadius: '12px' }}>{success}</Alert></Fade>}
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><AccountBalanceIcon color="primary" />Gönderen Hesap Seçimi</Typography>
                        <FormControl fullWidth required>
                          <InputLabel id="source-account-label">Hesabınızı Seçin</InputLabel>
                          <StyledSelect labelId="source-account-label" value={sourceAccountId} label="Hesabınızı Seçin" onChange={(e) => setSourceAccountId(e.target.value)} disabled={loading || myAccounts.length === 0}>
                            {myAccounts.map((account) => (
                              <MenuItem key={account.account_id} value={account.account_id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}><AccountBalanceIcon fontSize="small" /></Avatar>
                                  <Box>
                                    <Typography variant="body1" fontWeight="bold">{account.iban}</Typography>
                                    <Typography variant="body2" color="text.secondary">Bakiye: {parseFloat(account.balance).toFixed(2)} {account.currency_code}</Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            ))}
                          </StyledSelect>
                        </FormControl>
                      </Box>
                      <Divider><Chip label="Alıcı Bilgileri" color="primary" variant="outlined" /></Divider>
                      <Stack spacing={3}>
                          <StyledTextField required fullWidth label="Alıcı IBAN Numarası" value={destinationIban} onChange={(e) => setDestinationIban(e.target.value)} disabled={loading} InputProps={{ startAdornment: (<InputAdornment position="start"><AccountBalanceIcon color="primary" /></InputAdornment>), }}/>
                          <StyledTextField required fullWidth label="Alıcı Adı ve Soyadı" value={destinationFullName} onChange={(e) => setDestinationFullName(e.target.value)} disabled={loading} InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon color="primary" /></InputAdornment>), }}/>
                      </Stack>
                      <Divider><Chip label="Transfer Detayları" color="primary" variant="outlined" /></Divider>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <StyledTextField required fullWidth label="Tutar" type="number" inputProps={{ step: '0.01', min: '0.01' }} value={amount} onChange={(e) => setAmount(e.target.value)} disabled={loading} InputProps={{ startAdornment: (<InputAdornment position="start"><EuroIcon color="primary" /></InputAdornment>), endAdornment: <InputAdornment position="end">TRY</InputAdornment>, }}/>
                        <StyledTextField fullWidth label="Açıklama (Opsiyonel)" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} InputProps={{ startAdornment: (<InputAdornment position="start"><DescriptionIcon color="primary" /></InputAdornment>), }}/>
                      </Stack>
                      <Box sx={{ position: 'relative', pt: 2 }}>
                        <AnimatedButton type="submit" fullWidth variant="contained" disabled={loading || !sourceAccountId || !destinationIban || !destinationFullName || !amount} startIcon={<SendIcon />} size="large">
                          {loading ? 'İşlem Gerçekleştiriliyor...' : 'Para Transferini Gerçekleştir'}
                        </AnimatedButton>
                        {loading && (<CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '4px', marginLeft: '-12px' }}/>)}
                      </Box>
                      <Button variant="outlined" fullWidth onClick={resetForm} startIcon={<RefreshIcon />} sx={{ borderRadius: '12px', borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(102, 126, 234, 0.04)' } }}>
                        Formu Temizle
                      </Button>
                    </Stack>
                  </Box>
                </GlassCard>
              </Slide>
            </Box>

            <Box sx={{ flex: { xs: 1, md: 5 } }}>
              <Slide direction="left" in={true} timeout={1200}>
                <Stack spacing={4}>
                  <StyledCard>
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><InfoIcon />Transfer Özeti</Typography>
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        {selectedAccount && (<Box><Typography variant="body2" sx={{ opacity: 0.9 }}>Gönderen Hesap:</Typography><Typography variant="body1" fontWeight="bold">{selectedAccount.iban}</Typography><Typography variant="body2" sx={{ opacity: 0.8 }}>Bakiye: {parseFloat(selectedAccount.balance).toFixed(2)} {selectedAccount.currency_code}</Typography></Box>)}
                        {destinationFullName && (<Box><Typography variant="body2" sx={{ opacity: 0.9 }}>Alıcı:</Typography><Typography variant="body1" fontWeight="bold">{destinationFullName}</Typography>{destinationIban && (<Typography variant="body2" sx={{ opacity: 0.8 }}>{destinationIban}</Typography>)}</Box>)}
                        {amount && (<Box><Typography variant="body2" sx={{ opacity: 0.9 }}>Transfer Tutarı:</Typography><Typography variant="h5" fontWeight="bold">{parseFloat(amount).toFixed(2)} TRY</Typography></Box>)}
                        {description && (<Box><Typography variant="body2" sx={{ opacity: 0.9 }}>Açıklama:</Typography><Typography variant="body1">{description}</Typography></Box>)}
                      </Stack>
                    </CardContent>
                  </StyledCard>
                  <GlassCard sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">🔒 Güvenlik Bilgisi</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>Tüm transfer işlemleriniz 256-bit SSL şifreleme ile korunmaktadır.</Typography>
                    <Typography variant="body2" color="text.secondary">✓ Gerçek zamanlı doğrulama<br />✓ Anlık bildirimler<br />✓ İşlem geçmişi takibi</Typography>
                  </GlassCard>
                </Stack>
              </Slide>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TransactionPage;