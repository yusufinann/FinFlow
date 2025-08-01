import React from 'react';
import { Card, CardContent, List, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountListItem from './AccountListItem';

const AccountListCard = ({
  accounts,
  onUpdateAccount,
  isUpdatingAccount,
  editingAccountId,
  setEditingAccountId,
  onAddNewAccount, // Yeni bir hesap ekleme fonksiyonu için prop
}) => (
  <Card sx={{ mt: 3, width: '100%', textAlign: 'left' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" component="div">
          Müşteri Hesapları
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddNewAccount}
          sx={{ bgcolor: '#006442', '&:hover': { bgcolor: '#004d33' } }}
        >
          Yeni Hesap Ekle
        </Button>
      </Box>

      {accounts && accounts.length > 0 ? (
        <List dense>
          {accounts.map((account) => (
            <AccountListItem
              key={account.account_id}
              account={account}
              isEditing={editingAccountId === account.account_id}
              onToggleEdit={setEditingAccountId}
              onUpdate={onUpdateAccount}
              onCancel={() => setEditingAccountId(null)}
              isUpdating={isUpdatingAccount && editingAccountId === account.account_id}
            />
          ))}
        </List>
      ) : (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Müşterinin aktif hesabı bulunmamaktadır.
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default AccountListCard;