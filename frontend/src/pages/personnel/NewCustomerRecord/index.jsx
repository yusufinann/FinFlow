import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import customerService from '../../../api/customerService'; // Bu yolu kendi projenize göre doğrulayın

const NewCustomerPage = () => {
  const initialFormData = {
    tckn: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    id_serial_no: '',
    nationality: 'TC', // Varsayılan değer
    mother_name: '',
    father_name: '',
    phone_number: '',
    email: '',
    address: '',
    branch_code: '',
    created_by_personnel_id: '1', // Oturumdan alınacak personel ID'si ile değiştirilmeli
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await customerService.createCustomer(formData);
      if (response.success) {
        setSuccessMessage(
          `Müşteri başarıyla oluşturuldu! Müşteri Numarası: ${response.data.customerNumber}`
        );
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
          Yeni Müşteri Kaydı
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField name="tckn" label="T.C. Kimlik Numarası" value={formData.tckn} onChange={handleChange} required fullWidth inputProps={{ maxLength: 11 }} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="first_name" label="Ad" value={formData.first_name} onChange={handleChange} required fullWidth autoComplete="given-name" disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="last_name" label="Soyad" value={formData.last_name} onChange={handleChange} required fullWidth autoComplete="family-name" disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="birth_date" label="Doğum Tarihi" type="date" value={formData.birth_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel id="gender-select-label">Cinsiyet</InputLabel>
                <Select labelId="gender-select-label" id="gender" name="gender" value={formData.gender} label="Cinsiyet" onChange={handleChange}>
                  <MenuItem value="E">Erkek</MenuItem>
                  <MenuItem value="K">Kadın</MenuItem>
                  <MenuItem value="B">Belirtmek İstemiyor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="mother_name" label="Anne Adı" value={formData.mother_name} onChange={handleChange} fullWidth disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="father_name" label="Baba Adı" value={formData.father_name} onChange={handleChange} fullWidth disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="phone_number" label="Telefon Numarası" value={formData.phone_number} onChange={handleChange} required fullWidth autoComplete="tel" disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="email" label="E-posta Adresi" type="email" value={formData.email} onChange={handleChange} required fullWidth autoComplete="email" disabled={isSubmitting} />
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField name="id_serial_no" label="Kimlik Seri No" value={formData.id_serial_no} onChange={handleChange} fullWidth disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="nationality" label="Uyruk" value={formData.nationality} onChange={handleChange} fullWidth disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField name="branch_code" label="Şube Kodu" type="number" value={formData.branch_code} onChange={handleChange} fullWidth disabled={isSubmitting}/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField name="created_by_personnel_id" label="Kaydeden Personel ID" type="number" value={formData.created_by_personnel_id} onChange={handleChange} fullWidth disabled={isSubmitting}/>
            </Grid>
            <Grid item xs={12}>
              <TextField name="address" label="Adres" multiline rows={3} value={formData.address} onChange={handleChange} fullWidth disabled={isSubmitting} />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 4, py: 1.5 }}
          >
            {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Müşteriyi Kaydet'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewCustomerPage;