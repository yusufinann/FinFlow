import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import UpdateIcon from '@mui/icons-material/Update';
import authService from '../../../api/authService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getPersonnelProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || 'Profil verileri alınamadı.');
        }
      } catch (err) {
        setError(err.message || 'Sunucu ile bağlantı kurulamadı.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return null;
  }

  const roleDisplay = {
    ADMIN: { label: 'Yönetici (Admin)', color: 'error' },
    PERSONNEL: { label: 'Personel', color: 'info' },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Belirtilmemiş";
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getGender = (gender) => {
    if (gender === 'E') return 'Erkek';
    if (gender === 'K') return 'Kadın';
    return 'Belirtilmemiş';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 160, height: 160, mb: 2, bgcolor: 'secondary.main', fontSize: '5rem', boxShadow: 3 }}>
              {profile.first_name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {`${profile.first_name} ${profile.last_name}`}
            </Typography>
            <Chip
              label={roleDisplay[profile.role]?.label || 'Bilinmeyen Rol'}
              color={roleDisplay[profile.role]?.color || 'default'}
              sx={{ fontWeight: 'medium' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 3 }}>
              Personel Detayları
            </Typography>
            <List dense>
              <ListItem><ListItemIcon><BadgeIcon color="action" /></ListItemIcon><ListItemText primary="Kullanıcı Adı" secondary={profile.username} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><FingerprintIcon color="action" /></ListItemIcon><ListItemText primary="T.C. Kimlik Numarası" secondary={profile.tckn || "N/A"} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><AlternateEmailIcon color="action" /></ListItemIcon><ListItemText primary="E-posta Adresi" secondary={profile.email || "N/A"} /></ListItem>
              <Divider variant="inset" component="li" />
               <ListItem><ListItemIcon><PhoneIcon color="action" /></ListItemIcon><ListItemText primary="Telefon Numarası" secondary={profile.phone_number || "N/A"} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><HomeIcon color="action" /></ListItemIcon><ListItemText primary="Adres" secondary={profile.address || "N/A"} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><CakeIcon color="action" /></ListItemIcon><ListItemText primary="Doğum Tarihi" secondary={formatDate(profile.birth_date)} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><WcIcon color="action" /></ListItemIcon><ListItemText primary="Cinsiyet" secondary={getGender(profile.gender)} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><AccountBalanceIcon color="action" /></ListItemIcon><ListItemText primary="Şube Kodu" secondary={profile.branch_code || 'Merkez'} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><VpnKeyIcon color="action" /></ListItemIcon><ListItemText primary="Personel ID" secondary={profile.customer_id} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><EventAvailableIcon color="action" /></ListItemIcon><ListItemText primary="Üyelik Tarihi" secondary={profile.member_since} /></ListItem>
              <Divider variant="inset" component="li" />
              <ListItem><ListItemIcon><UpdateIcon color="action" /></ListItemIcon><ListItemText primary="Son Güncelleme" secondary={profile.last_update} /></ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;