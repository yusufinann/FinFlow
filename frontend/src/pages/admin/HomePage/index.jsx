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
  CircularProgress,
  Alert,
  Container,
  Stack,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Edit,
  Group as GroupIcon,
  AddCircleOutline,
  PeopleOutline,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import personnelService from '../../../api/adminPanelServices/personnelService';

const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

const GenderChip = ({ gender }) => {
  if (!gender) return <Typography variant="body2">-</Typography>;
  const isMale = gender.toUpperCase() === 'E';
  return (
    <Chip
      label={isMale ? 'Erkek' : 'Kadın'}
      size="small"
      sx={{
        bgcolor: isMale ? 'info.light' : 'success.light',
        color: isMale ? 'info.dark' : 'success.dark',
        fontWeight: 'bold',
      }}
    />
  );
};

const HomePage = () => {
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonnels();
  }, []);

  const fetchPersonnels = async () => {
    try {
      setLoading(true);
      const response = await personnelService.getAllPersonnels();
      setPersonnels(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Personel verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (personnel) => {
    console.log('Düzenlenecek Personel:', personnel);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
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
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <GroupIcon color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Personel Yönetimi
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sistemde kayıtlı {personnels.length} personel bulunmaktadır.
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            component={RouterLink}
            to="/admin/personnel/new"
            startIcon={<AddCircleOutline />}
            sx={{ py: 1.5, px: 3, borderRadius: '12px' }}
          >
            Yeni Personel Ekle
          </Button>
        </Stack>

        {personnels.length > 0 ? (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 1200 }} aria-label="personel-tablosu">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>Personel No</TableCell>
                    <TableCell>TCKN</TableCell>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>E-posta</TableCell>
                    <TableCell>Telefon</TableCell>
                    <TableCell>Doğum Tarihi</TableCell>
                    <TableCell align="center">Cinsiyet</TableCell>
                    <TableCell align="center">Şube Kodu</TableCell>
                    <TableCell align="center">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personnels.map((personnel) => (
                    <TableRow
                      key={personnel.customer_id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                        {personnel.username}
                      </TableCell>
                      <TableCell>{personnel.tckn}</TableCell>
                      <TableCell>{`${personnel.first_name} ${personnel.last_name}`}</TableCell>
                      <TableCell>{personnel.email || '-'}</TableCell>
                      <TableCell>{personnel.phone_number || '-'}</TableCell>
                      <TableCell>{formatDate(personnel.birth_date)}</TableCell>
                      <TableCell align="center">
                        <GenderChip gender={personnel.gender} />
                      </TableCell>
                      <TableCell align="center">
                        {personnel.branch_code ? (
                          <Chip label={personnel.branch_code} variant="outlined" size="small" />
                        ) : ('-')}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Düzenle">
                          <IconButton color="primary" onClick={() => handleEdit(personnel)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: '16px',
              borderColor: 'divider',
            }}
          >
            <PeopleOutline sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Sistemde Kayıtlı Personel Bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yeni personel eklemek için yukarıdaki butonu kullanabilirsiniz.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;