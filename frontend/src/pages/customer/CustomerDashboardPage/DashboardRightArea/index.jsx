import { Box, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Income from './Income';
import Expense from './Expense';
import Transactions from './Transactions';
import apiClient from '../../../../api/customerPanelServices/api';

const DashboardRightArea = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialSummary = async () => {
      setLoading(true);
      try {
        // GERÇEK API İSTEĞİ
        const response = await apiClient.get('/transactions/income-expense-summary');
        
        if (response.data.success) {
          setFinancialData(response.data);
        } else {
           console.error("API Error:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch financial summary:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialSummary();
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      width: '40vw',
      height: '100%',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      p: 3,
    }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <CircularProgress />
        </Box>
      ) : financialData ? (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <Income data={financialData.income} />
          <Expense data={financialData.expense} />
        </Box>
      ) : (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
            <p>Veriler yüklenemedi.</p>
         </Box>
      )}
      <Transactions />
    </Box>
  );
};

export default DashboardRightArea;