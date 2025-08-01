import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const AccountListItem = ({ account, isEditing, onToggleEdit, onUpdate, onCancel, isUpdating }) => {
  const [balance, setBalance] = useState(account.balance);

  const formattedBalance = parseFloat(account.balance).toLocaleString('tr-TR', {
    style: 'currency',
    currency: account.currency_code,
  });

  const handleUpdate = () => onUpdate(account.account_id, balance);
  const handleCancel = () => {
    setBalance(account.balance);
    onCancel();
  };

  return (
    <ListItem divider sx={{ py: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <ListItemText
            primary={account.iban}
            secondary={`${account.account_type_code} (No: ${account.account_number})`}
          />
          <TextField
            size="small"
            variant="outlined"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            disabled={isUpdating}
            sx={{ mx: 2, width: '180px' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">{account.currency_code}</InputAdornment>,
            }}
          />
          <Box sx={{ display: 'flex' }}>
            <IconButton edge="end" color="success" onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            </IconButton>
            <IconButton edge="end" color="error" onClick={handleCancel} disabled={isUpdating} sx={{ ml: 1 }}>
              <CancelIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <ListItemText
            primary={
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {account.iban}
              </Typography>
            }
            secondary={`${account.account_type_code} (No: ${account.account_number})`}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mr: 2, minWidth: '150px', textAlign: 'right' }}>
              {formattedBalance}
            </Typography>
            <IconButton edge="end" aria-label="edit" onClick={() => onToggleEdit(account.account_id)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </ListItem>
  );
};

export default AccountListItem;