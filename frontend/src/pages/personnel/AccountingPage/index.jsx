import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button, Grid, Paper,
  Alert, CircularProgress, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import accountService from '../../../api/accountService';
import { usePersonnelAuth } from '../../../shared/context/PersonnelAuthContext';

const accountTypeMapping = [
  { code: '12', name: 'Vadesiz Hesap' },
  { code: '123', name: 'Tasarruf Hesabı' },
  { code: '1', name: 'Cari Hesap' },
  { code: '2', name: 'Vadeli Hesap' },
];

const AccountingPage = () => {
  const { personnel } = usePersonnelAuth();

  const initialFormData = {
    tckn: '',
    account_type_code: '',
    currency_code: 'TRY',
    balance: '0.00',
    interest_rate: '0.00',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!personnel?.id) {
        setError("Personel bilgisi alınamadı. Lütfen yeniden giriş yapın.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    try {
      const payload = {
        ...formData,
        created_by_personnel_id: personnel.id,
      };
      const response = await accountService.createAccount(payload);
      if (response.success) {
        setSuccessMessage(`Hesap başarıyla oluşturuldu! IBAN: ${response.account.iban}`);
        setFormData(initialFormData);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Beklenmedik bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          Yeni Müşteri Hesabı Oluşturma
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField 
                name="tckn" 
                label="Müşteri TCKN" 
                value={formData.tckn} 
                onChange={handleChange} 
                required 
                fullWidth 
                type="text" 
                inputProps={{ maxLength: 11 }} 
                disabled={isSubmitting} 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={isSubmitting}>
                <InputLabel id="account-type-label">Hesap Türü</InputLabel>
                <Select
                  labelId="account-type-label"
                  name="account_type_code"
                  value={formData.account_type_code}
                  label="Hesap Türü"
                  onChange={handleChange}
                >
                  {accountTypeMapping.map((type) => (
                    <MenuItem key={type.code} value={type.code}>{type.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={isSubmitting}>
                <InputLabel id="currency-code-label">Para Birimi</InputLabel>
                <Select labelId="currency-code-label" name="currency_code" value={formData.currency_code} label="Para Birimi" onChange={handleChange}>
                  <MenuItem value="TRY">TRY (Türk Lirası)</MenuItem>
                  <MenuItem value="USD">USD (Amerikan Doları)</MenuItem>
                  <MenuItem value="EUR">EUR (Euro)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="balance" label="Başlangıç Bakiyesi" value={formData.balance} onChange={handleChange} fullWidth type="number" disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="interest_rate" label="Faiz Oranı (%)" value={formData.interest_rate} onChange={handleChange} fullWidth type="number" disabled={isSubmitting} />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting || !personnel?.id}
            sx={{ mt: 4, py: 1.5 }}
          >
            {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Hesabı Oluştur'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountingPage;