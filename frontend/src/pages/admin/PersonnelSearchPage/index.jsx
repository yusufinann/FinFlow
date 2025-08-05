import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Cake as CakeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import api from '../../../api/adminPanelServices/api'; // Az önce oluşturduğumuz API istemcisi

const PersonnelSearchPage = () => {
  const [tckn, setTckn] = useState('');
  const [personnelData, setPersonnelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (tckn.length !== 11) {
      setError('Lütfen 11 haneli geçerli bir TCKN giriniz.');
      return;
    }

    setLoading(true);
    setError('');
    setPersonnelData(null);

    try {
      const response = await api.get(`/${tckn}`);
      setPersonnelData(response.data.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Bu TCKN ile kayıtlı bir personel bulunamadı.');
      } else {
        setError('Arama sırasında bir sunucu hatası oluştu. Lütfen tekrar deneyin.');
      }
      console.error("Personel arama hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personel Arama
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Bilgilerini görüntülemek istediğiniz personelin TCKN'sini giriniz.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            fullWidth
            label="Personel TCKN"
            variant="outlined"
            value={tckn}
            onChange={(e) => setTckn(e.target.value)}
            onKeyPress={handleKeyPress}
            inputProps={{ maxLength: 11 }}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !tckn}
            sx={{ ml: 2, py: '15px', px: 4 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {personnelData && (
          <Card sx={{ mt: 4 }} variant="outlined">
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              }
              title={`${personnelData.first_name} ${personnelData.last_name}`}
              subheader={`Personel No: ${personnelData.username} | TCKN: ${personnelData.tckn}`}
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="E-posta" secondary={personnelData.email || 'Belirtilmemiş'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon /></ListItemIcon>
                  <ListItemText primary="Telefon" secondary={personnelData.phone_number || 'Belirtilmemiş'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><BusinessIcon /></ListItemIcon>
                  <ListItemText primary="Şube Kodu" secondary={personnelData.branch_code || 'Belirtilmemiş'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CakeIcon /></ListItemIcon>
                  <ListItemText primary="Doğum Tarihi" secondary={personnelData.birth_date ? new Date(personnelData.birth_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><HomeIcon /></ListItemIcon>
                  <ListItemText primary="Adres" secondary={personnelData.address || 'Belirtilmemiş'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default PersonnelSearchPage;