import React from 'react';
import { Card, CardContent, List, Typography, Box} from '@mui/material';
import AccountListItem from './AccountListItem';

const AccountListCard = ({
  accounts,
  onUpdateAccount,
  isUpdatingAccount,
  editingAccountId,
  setEditingAccountId,
}) => (
  <Card sx={{ mt: 3, width: '100%', textAlign: 'left' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" component="div">
          Müşteri Hesapları
        </Typography>
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