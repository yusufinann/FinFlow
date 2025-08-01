import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Alert, Divider, Chip, Tooltip, Snackbar } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import accountService from '../../../../api/customerPanelServices/accountService';
import accountwallet from '../../../../assets/accountwallet.png';
import { useWebSocket } from '../../../../shared/context/websocketContext';

const MyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const data = await accountService.getMyAccounts();
        if (data.success && data.accounts) {
          setAccounts(data.accounts);
        } else {
          setError(data.message || 'Hesaplar yüklenemedi.');
        }
      } catch (err) {
        setError(err.message || 'Bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    
    if (lastMessage && (lastMessage.type === 'INCOMING_TRANSFER' || lastMessage.type === 'TRANSFER_RECEIVED' || lastMessage.type === 'TRANSFER_SENT')) {
      const { accountId, newBalance, amount, currency } = lastMessage.data;

     
      setAccounts(prevAccounts =>
        prevAccounts.map(account =>
          String(account.account_id) === String(accountId)
            ? { ...account, balance: newBalance }
            : account
        )
      );
      
   
      if (lastMessage.type !== 'TRANSFER_SENT') {
        const formattedAmount = new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
        setSnackbarMessage(`Hesabınıza ${formattedAmount} tutarında transfer geldi!`);
        setSnackbarOpen(true);
      }
    }
  }, [lastMessage]);

  const handlePrevious = () => {
    if (accounts.length > 1) {
      setCurrentIndex(prev => (prev === 0 ? accounts.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (accounts.length > 1) {
      setCurrentIndex(prev => (prev === accounts.length - 1 ? 0 : prev + 1));
    }
  };

  const getAccountTypeName = (typeCode) => {
    const types = { '12': 'Vadesiz Hesap', '123': 'Tasarruf Hesabı', '1': 'Cari Hesap', '2': 'Vadeli Hesap' };
    return types[typeCode] || 'Banka Hesabı';
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return '';
    return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(`${label} kopyalandı`);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', width: '40vw', p: 2 }}>
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Box>
    );
  }

  if (accounts.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', width: '40vw', background: "rgba(255,255,255,0.6)", borderRadius: '20px', boxShadow: 3, p: 2 }}>
        <Typography variant="h6">Görüntülenecek Hesap Bulunamadı</Typography>
        <Typography variant="body1" color="text.secondary">Henüz bir banka hesabınız yok.</Typography>
      </Box>
    );
  }

  const currentAccount = accounts[currentIndex];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '2rem', width: '40vw', height: '70vh', background: "rgba(255,255,255,0.6)", boxShadow: 3, borderRadius: '20px', padding: '1.5rem', position: 'relative' }}>
      
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: '1.5rem' }}>
        <IconButton onClick={handlePrevious} sx={{ color: '#666', '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
          <ArrowBackIosIcon />
        </IconButton>
        
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, fontSize: '1.1rem' }}>
          Hesaplarım
        </Typography>
        
        <IconButton onClick={handleNext} sx={{ color: '#666', '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '1rem', width: '100%' }}>
        <Box component="img" src={accountwallet} alt="Account Wallet" sx={{ width: '300px', height: 'auto', mb: '1rem', zIndex: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }} />

        <Chip icon={<AccountBalanceIcon />} label={getAccountTypeName(currentAccount.account_type_code)} sx={{ backgroundColor: '#667eea', color: 'white', fontWeight: 600, mb: '1rem', fontSize: '0.9rem' }} />

        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '2.2rem', color: '#667eea', mb: '1.5rem' }}>
          {formatCurrency(currentAccount.balance, currentAccount.currency_code)}
        </Typography>

        <Divider sx={{ width: '80%', mb: '1.5rem' }} />

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: '100%', maxWidth: '450px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(102, 126, 234, 0.1)', padding: '1rem', borderRadius: '12px', flex: 1, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '0.5rem' }}>
              <CreditCardIcon sx={{ color: '#667eea', mr: '0.5rem', fontSize: '1.2rem' }} />
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', fontWeight: 500 }}>Hesap Numarası</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>
              {formatAccountNumber(currentAccount.account_number)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(102, 126, 234, 0.1)', padding: '1rem', borderRadius: '12px', flex: 1, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '0.5rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ color: '#667eea', mr: '0.5rem', fontSize: '1.2rem' }} />
                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', fontWeight: 500 }}>IBAN</Typography>
              </Box>
              <Tooltip title="IBAN'ı Kopyala" arrow>
                <IconButton size="small" onClick={() => handleCopy(currentAccount.iban, 'IBAN')} sx={{ color: '#667eea', '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.2)', transform: 'scale(1.1)' }, transition: 'all 0.2s ease' }}>
                  <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', fontSize: '0.85rem', wordBreak: 'break-all' }}>
              {currentAccount.iban}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        {accounts.map((_, index) => (
          <Box key={index} sx={{ width: index === currentIndex ? '24px' : '10px', height: '10px', borderRadius: '5px', background: index === currentIndex ? '#667eea' : '#E0E0E0', transition: 'all 0.3s ease', cursor: 'pointer' }}
          onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>

      <Typography variant="caption" sx={{ color: '#666', fontSize: '0.85rem', position: 'absolute', bottom: '1rem', right: '1.5rem' }}>
        {currentIndex + 1} / {accounts.length}
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ '& .MuiSnackbarContent-root': { backgroundColor: '#667eea', color: 'white', borderRadius: '8px' } }}
      />
    </Box>
  )
}

export default MyAccounts;