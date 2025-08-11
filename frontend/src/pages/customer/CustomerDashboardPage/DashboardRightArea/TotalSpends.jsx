import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Savings,
  Receipt,
  TrendingUp, // Gelir için daha genel bir ikon
  TrendingDown, // Gider için daha genel bir ikon
} from '@mui/icons-material';
import transactionService from '../../../../api/customerPanelServices/transactionService';

// İkonları ve renklerini yeni tasarıma göre güncelleyelim
const iconMapping = {
  'MAAS': { icon: <AccountBalance />, color: 'primary' },
  'SOSYAL_YARDIM': { icon: <Savings />, color: 'success' },
  'KREDI_KARTI': { icon: <CreditCard />, color: 'error' },
  'FATURA': { icon: <Receipt />, color: 'error' },
  'DEFAULT_INCOME': { icon: <TrendingUp />, color: 'success' },
  'DEFAULT_EXPENSE': { icon: <TrendingDown />, color: 'error' }
};

const TotalSpends = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const data = await transactionService.getDashboardSummary();
        if (data.success) {
          setTransactions(data.transactions);
          setTotalBalance(data.totalBalance);
        } else {
          throw new Error(data.message || 'Özet verileri alınamadı.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Ana bileşen için Paper stili
  const paperStyles = {
    p: 3,
    width: '100%',
    minHeight: '500px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.paper'
  };

  if (isLoading) {
    return (
      <Paper sx={{ ...paperStyles, justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress color="primary" />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={paperStyles}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={paperStyles}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Son İşlemler
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Toplam Bakiye
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
            {totalBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Transactions List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
        {transactions.length > 0 ? (
          <List disablePadding>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const iconKey = transaction.category?.toUpperCase() || (isIncome ? 'DEFAULT_INCOME' : 'DEFAULT_EXPENSE');
              const { icon, color } = iconMapping[iconKey] || iconMapping.DEFAULT_EXPENSE;

              // MUI theme'den renkleri alalım (error.main, success.main vb.)
              const amountColor = isIncome ? 'success.main' : 'error.main';
              const avatarBgColor = isIncome ? 'success.light' : 'error.light';
              const iconColor = isIncome ? 'success.dark' : 'error.dark';

              return (
                <ListItem
                  key={transaction.id}
                  secondaryAction={
                    <Typography variant="body1" sx={{ fontWeight: 700, color: amountColor }}>
                      {isIncome ? '+' : '-'}
                      {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </Typography>
                  }
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: '12px',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: avatarBgColor, color: iconColor }}>
                      {icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {transaction.name}
                      </Typography>
                    }
                    secondary={
                      new Date(transaction.date).toLocaleDateString('tr-TR', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      })
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '250px',
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            <Receipt sx={{ fontSize: 48, mb: 2, color: 'grey.300' }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Son işlem bulunamadı
            </Typography>
            <Typography>Yeni bir işlem yaptığınızda burada görünecektir.</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TotalSpends;