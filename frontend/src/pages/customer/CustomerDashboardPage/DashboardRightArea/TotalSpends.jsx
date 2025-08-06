import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { AccountBalance, CreditCard, Savings, Receipt } from '@mui/icons-material';
import transactionService from '../../../../api/customerPanelServices/transactionService';

const iconMapping = {
    'MAAS': <AccountBalance sx={{ color: 'white' }} />,
    'SOSYAL_YARDIM': <Savings sx={{ color: 'white' }} />,
    'KREDI_KARTI': <CreditCard sx={{ color: 'white' }} />,
    'FATURA': <Receipt sx={{ color: 'white' }} />,
    'DEFAULT_INCOME': <Savings sx={{ color: 'white' }} />,
    'DEFAULT_EXPENSE': <Receipt sx={{ color: 'white' }} />
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

  if (isLoading) {
    return (
      <Card sx={{ 
        width: '100%', 
        height: '45vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(229, 62, 62, 0.15)',
        background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 50%, #9B2C2C 100%)'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ 
        width: '100%', 
        height: '45vh', 
        p: 3,
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(229, 62, 62, 0.15)',
        background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 50%, #9B2C2C 100%)'
      }}>
        <Alert 
          severity="error" 
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          {error}
        </Alert>
      </Card>
    );
  }

  return (
    <Card sx={{
      width: '100%',
      minHeight: '500px',
      background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 50%, #9B2C2C 100%)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(229, 62, 62, 0.25)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Decorative elements */}
      <Box sx={{ 
        position: 'absolute', 
        top: -60, 
        right: -60, 
        width: '200px', 
        height: '200px', 
        borderRadius: '50%', 
        background: 'rgba(255,255,255,0.08)',
        opacity: 0.7
      }} />
      <Box sx={{ 
        position: 'absolute', 
        bottom: -40, 
        left: -40, 
        width: '120px', 
        height: '120px', 
        borderRadius: '50%', 
        background: 'rgba(255,255,255,0.06)',
        opacity: 0.5
      }} />
      
      <CardContent sx={{ 
        p: 3.5, 
        height: '100%', 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 3,
          pb: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            color: 'white',
            fontSize: '1.5rem',
            letterSpacing: '-0.5px'
          }}>
            Son İşlemler
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '0.875rem',
              mb: 0.5,
              fontWeight: 500
            }}>
              Bakiye
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: '#fff',
              fontSize: '1.25rem'
            }}>
              {totalBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Typography>
          </Box>
        </Box>

        {/* Transactions List */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          pr: 1,
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px' 
          },
          '&::-webkit-scrollbar-thumb': { 
            background: 'rgba(255,255,255,0.3)', 
            borderRadius: '2px',
            '&:hover': {
              background: 'rgba(255,255,255,0.4)'
            }
          }
        }}>
          {transactions.length > 0 ? transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const avatarColor = isIncome ? 'rgba(72, 187, 120, 0.9)' : 'rgba(245, 101, 101, 0.9)';
              const amountColor = isIncome ? '#68D391' : '#FC8181';
              const iconKey = transaction.category?.toUpperCase() || (isIncome ? 'DEFAULT_INCOME' : 'DEFAULT_EXPENSE');
              const icon = iconMapping[iconKey] || iconMapping.DEFAULT_EXPENSE;

              return (
                <Box 
                  key={transaction.id} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    p: 2.5, 
                    mb: 1.5, 
                    backgroundColor: 'rgba(255,255,255,0.12)', 
                    borderRadius: '12px', 
                    backdropFilter: 'blur(10px)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    },
                    '&:last-child': {
                      mb: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1 }}>
                    <Avatar sx={{ 
                      backgroundColor: avatarColor, 
                      width: 48, 
                      height: 48,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
                    }}>
                      {icon}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 600, 
                        color: 'white',
                        fontSize: '1rem',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {transaction.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.85rem',
                        fontWeight: 400
                      }}>
                        {new Date(transaction.date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right', ml: 2 }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 700, 
                      color: amountColor,
                      fontSize: '1.05rem'
                    }}>
                      {isIncome ? '+' : ''}
                      {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </Typography>
                  </Box>
                </Box>
              )
          }) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '250px',
              textAlign: 'center'
            }}>
              <Receipt sx={{ 
                fontSize: 56, 
                color: 'rgba(255,255,255,0.25)', 
                mb: 2 
              }} />
              <Typography sx={{
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '1.1rem',
                fontWeight: 500
              }}>
                Son işlem bulunamadı.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalSpends;