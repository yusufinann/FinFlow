import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { AccountBalance, CreditCard, Savings, Receipt } from '@mui/icons-material';
import transactionService from '../../../../api/customerPanelServices/transactionService';

const iconMapping = {
    'MAAS': <AccountBalance />,
    'SOSYAL_YARDIM': <Savings />,
    'KREDI_KARTI': <CreditCard />,
    'FATURA': <Receipt />,
    'DEFAULT_INCOME': <Savings />,
    'DEFAULT_EXPENSE': <Receipt />
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
      <Card sx={{ width: '100%', height: '45vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ width: '100%', height: '45vh', p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Card>
    );
  }

  return (
    <Card sx={{
      width: '100%',
      height: '45vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', transform: 'translate(50%, -50%)' }} />
      
      <CardContent sx={{ p: 3, height: '100%', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            Son İşlemler
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: 'white', opacity: 0.8 }}>
              Bakiye:
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
              {totalBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)', borderRadius: '3px' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.3)', borderRadius: '3px' }
        }}>
          {transactions.length > 0 ? transactions.map((transaction) => {
              const isIncome = transaction.type === 'income';
              const color = isIncome ? '#4CAF50' : '#f44336';
              const iconKey = transaction.category?.toUpperCase() || (isIncome ? 'DEFAULT_INCOME' : 'DEFAULT_EXPENSE');
              const icon = iconMapping[iconKey] || iconMapping.DEFAULT_EXPENSE;

              return (
                <Box key={transaction.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ backgroundColor: color, width: 40, height: 40 }}>
                      {icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                        {transaction.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {new Date(transaction.date).toLocaleDateString('tr-TR')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: color }}>
                    {isIncome ? '+' : ''}
                    {transaction.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </Typography>
                </Box>
              )
          }) : <Typography sx={{textAlign: 'center', color: 'rgba(255,255,255,0.7)', pt: 4}}>Son işlem bulunamadı.</Typography>}
        </Box>
      </CardContent>
    </Card>
  )
}
export default TotalSpends;