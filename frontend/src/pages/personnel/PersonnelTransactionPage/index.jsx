import React from 'react';
import {
  Container, Typography, Box, TextField, Button, Paper, CircularProgress,
  Alert, List, ListItemButton, ListItemText, Divider,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { usePersonnelTransactionPage } from './usePersonnelTransactionPage';

const sourceAccounts = [
    { iban: 'TR110006200000000000000001', name: 'Havuz Hesabı (TRY)', currency: 'TRY' },
    { iban: 'TR220006200000000000000003', name: 'Havuz Hesabı (USD)', currency: 'USD' },
    { iban: 'TR330006200000000000000004', name: 'Havuz Hesabı (EUR)', currency: 'EUR' },
];

const transactionCategories = {
    'MAAS': ['EMEKLİ_MAASI', 'MEMUR_MAASI', 'ÖZEL_SEKTÖR_MAASI', 'AVANS', 'İKRAMİYE'],
    'SOSYAL_YARDIM': ['BURS_ÖDEMESİ', 'NAFAKA', 'DEVLET_DESTEĞİ'],
    'KIRA': ['İŞYERİ_KİRASI', 'KONUT_KİRASI'],
    'DIGER': ['Tedarikçi Ödemesi', 'Özel Transfer'],
};

function PersonnelTransactionPage() {
    const {
        searchQuery, setSearchQuery, customer, accounts, selectedAccount, transferDetails,
        isLoading, error, success, handleSearch, handleAccountSelect, handleFormChange, handleTransferSubmit
    } = usePersonnelTransactionPage();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };
    
    const handleTransferFormSubmit = (e) => {
        e.preventDefault();
        handleTransferSubmit();
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                Personel Para Transfer İşlemleri
            </Typography>

            <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
                <TextField
                    label="Müşteri TCKN veya Müşteri Numarası"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    disabled={isLoading}
                />
                <Button type="submit" variant="contained" size="large" disabled={isLoading || !searchQuery} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />} sx={{ height: '56px', px: 4, bgcolor: '#E30613', '&:hover': { bgcolor: '#b5040f' } }}>
                    Sorgula
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {customer && (
                <Box>
                    <Typography variant="h6">Müşteri Bilgileri</Typography>
                    <Typography><strong>Ad Soyad:</strong> {customer.first_name} {customer.last_name}</Typography>
                    <Typography><strong>Müşteri No:</strong> {customer.customer_number}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Müşteri Hesapları (Para Gönderilecek Hesabı Seçin)</Typography>
                    {accounts.length > 0 ? (
                        <List dense>
                            {accounts.map(acc => (
                                <ListItemButton key={acc.account_id} selected={selectedAccount?.account_id === acc.account_id} onClick={() => handleAccountSelect(acc)} sx={{ borderRadius: 1, my: 0.5 }}>
                                    <ListItemText primary={`${acc.iban} - (${acc.currency_code})`} secondary={`Bakiye: ${parseFloat(acc.balance).toLocaleString('tr-TR', { style: 'currency', currency: acc.currency_code })}`} />
                                </ListItemButton>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="warning" sx={{ mt: 2 }}>Müşterinin transfer yapılabilecek aktif bir hesabı bulunmamaktadır.</Alert>
                    )}
                </Box>
            )}

            {selectedAccount && (
                <Box component="form" onSubmit={handleTransferFormSubmit} sx={{ mt: 4, border: '1px solid #ddd', p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom>Transfer Detayları</Typography>
                    <TextField label="Hedef Hesap (Müşteri)" value={selectedAccount.iban} disabled fullWidth sx={{ mb: 2, bgcolor: '#f1f1f1' }} />
                     <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="source-account-label">Kaynak Hesap (Banka)</InputLabel>
                        <Select labelId="source-account-label" name="source_account_iban" value={transferDetails.source_account_iban || ''} label="Kaynak Hesap (Banka)" onChange={handleFormChange} required>
                            {sourceAccounts.filter(sa => sa.currency === selectedAccount.currency_code).map(acc => <MenuItem key={acc.iban} value={acc.iban}>{acc.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Tutar" name="amount" type="number" value={transferDetails.amount} onChange={handleFormChange} required fullWidth sx={{ mb: 2 }} inputProps={{ step: "0.01" }} />
                    <TextField label="Para Birimi" value={transferDetails.currency_code} disabled fullWidth sx={{ mb: 2, bgcolor: '#f1f1f1' }} />

                    <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 2, mb: 2 }}>
                        <FormControl fullWidth sx={{ mb: { xs: 2, md: 0 } }}>
                            <InputLabel id="category-label">İşlem Kategorisi</InputLabel>
                            <Select labelId="category-label" name="transaction_category" value={transferDetails.transaction_category || ''} label="İşlem Kategorisi" onChange={handleFormChange} required>
                                {Object.keys(transactionCategories).map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {transferDetails.transaction_category && (
                             <FormControl fullWidth>
                                <InputLabel id="subtype-label">İşlem Alt Tipi</InputLabel>
                                <Select labelId="subtype-label" name="transaction_subtype" value={transferDetails.transaction_subtype || ''} label="İşlem Alt Tipi" onChange={handleFormChange} required>
                                    {transactionCategories[transferDetails.transaction_category].map(sub => <MenuItem key={sub} value={sub}>{sub}</MenuItem>)}
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    <TextField label="Açıklama" name="description" value={transferDetails.description} onChange={handleFormChange} required fullWidth multiline rows={3} sx={{ mb: 2 }} />

                    <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading} fullWidth sx={{ bgcolor: '#006442', '&:hover': { bgcolor: '#004d33' } }}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Transferi Gerçekleştir'}
                    </Button>
                </Box>
            )}
        </Paper>
    </Container>
  );
}

export default PersonnelTransactionPage;