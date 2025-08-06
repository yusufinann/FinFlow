import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  colors,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import transactionService from '../../../../api/customerPanelServices/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await transactionService.getRecentTransactions();
        if (data.success) {
          setTransactions(data.transactions);
        } else {
          throw new Error(data.message || 'İşlemler alınamadı.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      );
    }
    
    if (transactions.length === 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="text.secondary">Henüz bir işlem yapmadınız.</Typography>
        </Box>
      );
    }

    return (
      <List disablePadding>
        {transactions.map((tx, index) => (
          <React.Fragment key={tx.id}>
            <ListItem sx={{ py: 1.5 }}>
              <ListItemAvatar>
                <Avatar sx={{ 
                  bgcolor: tx.type === 'sent' ? colors.red[100] : colors.green[100],
                  color: tx.type === 'sent' ? colors.red[600] : colors.green[600],
                }}>
                  {tx.type === 'sent' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {tx.description}
                  </Typography>
                }
                secondary={`Kimden: ${tx.partyName}`}
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: tx.type === 'sent' ? colors.red[700] : colors.green[700]
                }}
              >
                {tx.type === 'sent' ? '-' : '+'} {formatCurrency(tx.amount, tx.currency)}
              </Typography>
            </ListItem>
            {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Card sx={{
      width: '100%', 
      height: '50vh', 
      borderRadius: '20px',
      boxShadow: 3,
      background: 'rgba(255, 255, 255, 0.7)', 
      backdropFilter: 'blur(10px)', 
      padding: '1rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1A2027' }}>
        Son İşlemler
      </Typography>

      <Box sx={{
        flexGrow: 1, 
        overflow: 'auto', 
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }
      }}>
        {renderContent()}
      </Box>
    </Card>
  );  
}

export default Transactions;