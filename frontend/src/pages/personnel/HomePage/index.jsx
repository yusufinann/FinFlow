import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Stack
} from '@mui/material';
import { Edit, PersonOff, Person } from '@mui/icons-material';
import customerService from '../../../api/customerService';

const HomePage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      setCustomers(response.customers);
      setError(null);
    } catch (err) {
      setError(err.message || 'Müşteriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (tckn, currentStatus) => {
    try {
      await customerService.updateCustomer(tckn, { is_active: !currentStatus });
      await fetchCustomers();
    } catch (err) {
      setError(err.message || 'Müşteri durumu güncellenirken hata oluştu');
    }
  };

  const handleEdit = (customer) => {
    console.log('Edit customer:', customer);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Müşteri Yönetimi
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Toplam {customers.length} müşteri
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Müşteri No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>TCKN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ad Soyad</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>E-posta</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Telefon</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.customer_id}
                sx={{ 
                  '&:hover': { backgroundColor: 'grey.50' },
                  opacity: customer.is_active ? 1 : 0.6 
                }}
              >
                <TableCell sx={{ fontWeight: 'medium' }}>
                  {customer.customer_number}
                </TableCell>
                <TableCell>{customer.tckn}</TableCell>
                <TableCell>
                  {customer.first_name} {customer.last_name}
                </TableCell>
                <TableCell>{customer.email || '-'}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>
                  <Chip
                    label={customer.is_active ? 'Aktif' : 'Pasif'}
                    color={customer.is_active ? 'success' : 'default'}
                    size="small"
                    icon={customer.is_active ? <Person /> : <PersonOff />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(customer)}
                      sx={{ minWidth: 100 }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant={customer.is_active ? "outlined" : "contained"}
                      size="small"
                      color={customer.is_active ? "error" : "success"}
                      startIcon={customer.is_active ? <PersonOff /> : <Person />}
                      onClick={() => handleToggleStatus(customer.tckn, customer.is_active)}
                      sx={{ minWidth: 100 }}
                    >
                      {customer.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {customers.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Henüz kayıtlı müşteri bulunmamaktadır.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;