import React, { useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccountBalanceWallet as AccountIcon,
  People as PeopleIcon,
  ReceiptLong as TransactionIcon,
  HelpOutline as DefaultIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import api from '../../../api/adminPanelServices/api';

const entityIcons = {
  CUSTOMER: <PersonIcon />,
  ACCOUNT: <AccountIcon />,
  PERSONNEL: <PeopleIcon />,
  TRANSACTION: <TransactionIcon />,
  CUSTOMER_LIST: <PeopleIcon />,
  DEFAULT: <DefaultIcon />,
};

const renderRow = ({ index, style, data }) => {
  const log = data[index];
  const icon = entityIcons[log.entity_type] || entityIcons.DEFAULT;
  const isSuccess = log.status === 'SUCCESS';

  return (
    <div style={style}>
      <ListItem component="div" key={log.log_id} divider>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: isSuccess ? 'success.light' : 'error.light' }}>
            {icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" component="span">
                {log.action_type.replace(/_/g, ' ')}
              </Typography>
              <Chip
                label={log.status}
                color={isSuccess ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </Box>
          }
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary" display="block">
                Personel: {log.personnel_name} ({log.personnel_username})
              </Typography>
              {log.entity_identifier && `müşteri TCKN: ${log.entity_identifier} | `}
              {format(new Date(log.created_at), "d MMMM yyyy, HH:mm:ss", { locale: tr })}
            </>
          }
        />
      </ListItem>
    </div>
  );
};

const PersonnelLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/activity-logs');
        setLogs(response.data.logs || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Loglar yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    if (logs.length === 0) {
      return <Alert severity="info" sx={{ m: 2 }}>Görüntülenecek personel aktivitesi bulunamadı.</Alert>;
    }

    return (
      <FixedSizeList
        height={600}
        width="100%"
        itemSize={90}
        itemCount={logs.length}
        overscanCount={5}
        itemData={logs}
      >
        {renderRow}
      </FixedSizeList>
    );
  };

  return (
    <Paper elevation={3}>
      <Typography variant="h5" gutterBottom sx={{ px: 2, pt: 1 }}>
        Personel Aktivite Logları
      </Typography>
      <Divider />
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {renderContent()}
      </Box>
    </Paper>
  );
};

export default PersonnelLogs;