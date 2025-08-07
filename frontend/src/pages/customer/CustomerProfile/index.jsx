import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, 
  CircularProgress, Alert, Avatar, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import EventIcon from '@mui/icons-material/Event';
import customerService from '../../../api/customerPanelServices/authService';
import { useCustomerAuth } from '../../../shared/context/CustomerAuthContext';

const ziraatRed = '#E30613';

const ProfileItem = ({ icon, primary, secondary }) => (
  <>
    <ListItem>
      <ListItemIcon sx={{color: ziraatRed}}>{icon}</ListItemIcon>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
    <Divider variant="inset" component="li" />
  </>
);

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { customer } = useCustomerAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await customerService.getProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          throw new Error(response.message || 'Profil bilgileri alınamadı.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  if (!profile) {
    return <Alert severity="info" sx={{ m: 3 }}>Profil bilgisi bulunamadı.</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 120, height: 120, bgcolor: ziraatRed, margin: '0 auto', fontSize: '3rem' }}>
                {customer?.fullName?.[0].toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography color="text.secondary">
                Müşteri
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom sx={{ borderBottom: `2px solid ${ziraatRed}`, pb: 1, mb: 2 }}>
                Kişisel Bilgiler
              </Typography>
              <List>
                <ProfileItem icon={<BadgeIcon />} primary="Müşteri Numarası" secondary={profile.customer_number} />
                <ProfileItem icon={<PersonIcon />} primary="Ad Soyad" secondary={`${profile.first_name} ${profile.last_name}`} />
                <ProfileItem icon={<MailOutlineIcon />} primary="E-posta Adresi" secondary={profile.email} />
                <ProfileItem icon={<PhoneIcon />} primary="Telefon Numarası" secondary={profile.phone_number} />
                <ProfileItem icon={<HomeIcon />} primary="Adres" secondary={profile.address || 'Belirtilmemiş'} />
                <ProfileItem icon={<EventIcon />} primary="Üyelik Tarihi" secondary={profile.member_since} />
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerProfile;