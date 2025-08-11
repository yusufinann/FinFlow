import React from 'react';
import { Box, Container, Typography, TextField, Button, Paper, CircularProgress, Alert, IconButton, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useCustomerSearchPage } from './useCustomerSearchPage';
import AccountListCard from './components/AccountListCard';
import CustomerResultCard from './components/CustomerResultCard';

const CustomerSearchPage = () => {
  const {
    tckn, setTckn, searchResult, isLoading, error, setError, isEditing,
    editableCustomer, isUpdating, updateAlert, setUpdateAlert,
    editingAccountId, setEditingAccountId, isUpdatingAccount,
    disableActions, isOtpModalOpen, setOtpModalOpen, otp, setOtp,
    isTogglingStatus, handleSearch, handleEditToggle,
    handleFieldChange, handleUpdate, handleUpdateAccount,
    handleToggleStatusClick, handleConfirmToggleStatus
  } = useCustomerSearchPage();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Müşteri Bilgi Sorgulama
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <TextField fullWidth variant="outlined" label="T.C. Kimlik Numarası Giriniz" value={tckn} onChange={(e) => setTckn(e.target.value)} inputProps={{ maxLength: 11 }} disabled={isLoading || disableActions} />
          <Button type="submit" variant="contained" size="large" disabled={isLoading || !tckn || disableActions} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />} sx={{ height: '56px', px: 4, bgcolor: '#006442', '&:hover': { bgcolor: '#004d33' } }}>
            Ara
          </Button>
        </Box>

        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        
        <Collapse in={!!updateAlert}>
          <Alert severity={updateAlert?.type || 'info'} action={<IconButton aria-label="close" color="inherit" size="small" onClick={() => setUpdateAlert(null)}><CloseIcon fontSize="inherit" /></IconButton>} sx={{ mb: 2 }}>
            {updateAlert?.message}
          </Alert>
        </Collapse>

        {searchResult && searchResult.success && (
          <>
            <CustomerResultCard 
              customer={searchResult.customer} 
              isEditing={isEditing} 
              onEditToggle={handleEditToggle} 
              onUpdate={handleUpdate} 
              onFieldChange={handleFieldChange} 
              editableCustomer={editableCustomer} 
              isUpdating={isUpdating}
              onToggleStatus={handleToggleStatusClick}
              isTogglingStatus={isTogglingStatus}
            />
            <AccountListCard 
              accounts={searchResult.accounts} 
              onUpdateAccount={handleUpdateAccount} 
              isUpdatingAccount={isUpdatingAccount} 
              editingAccountId={editingAccountId} 
              setEditingAccountId={setEditingAccountId} 
            />
          </>
        )}
      </Paper>

      <Dialog open={isOtpModalOpen} onClose={() => setOtpModalOpen(false)}>
        <DialogTitle>Durum Değişikliği Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Lütfen işleme devam etmek için onay kodunu giriniz. (Kod konsola yazdırılmıştır)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="otp"
            label="Onay Kodu (OTP)"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isTogglingStatus}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={() => setOtpModalOpen(false)} color="secondary" disabled={isTogglingStatus}>
            İptal
          </Button>
          <Button 
            onClick={handleConfirmToggleStatus} 
            variant="contained" 
            color="primary" 
            disabled={isTogglingStatus || otp.length < 6}
            startIcon={isTogglingStatus ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerSearchPage;