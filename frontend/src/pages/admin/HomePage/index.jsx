import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, CircularProgress, Alert, Container,
  Stack, Tooltip, IconButton, Chip, Badge, Switch, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, DialogContentText
} from '@mui/material';
import { Edit, Group as GroupIcon, AddCircleOutline, PeopleOutline, Timer } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import personnelService from '../../../api/adminPanelServices/personnelService';
import { useWebSocket } from '../../../shared/context/websocketContext';

const StyledBadge = styled(Badge)(({ theme, ownerState }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: ownerState.status === 'online' ? '#44b700' : '#8a8a8a',
    color: ownerState.status === 'online' ? '#44b700' : '#8a8a8a',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: ownerState.status === 'online' ? 'ripple 1.2s infinite ease-in-out' : 'none',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': { transform: 'scale(.8)', opacity: 1 },
    '100%': { transform: 'scale(2.4)', opacity: 0 },
  },
}));

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const HomePage = () => {
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  const [personnelToToggle, setPersonnelToToggle] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(180);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { personnelStatuses } = useWebSocket();

  const fetchPersonnels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await personnelService.getAllPersonnels();
      setPersonnels(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Personel verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonnels();
  }, [fetchPersonnels]);

  useEffect(() => {
    let interval;
    if (otpModalOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && otpModalOpen) {
      setOtpModalOpen(false);
      setNotification({ open: true, message: 'Süre doldu, lütfen işlemi yeniden başlatın.', severity: 'error' });
    }
    return () => clearInterval(interval);
  }, [otpModalOpen, timer]);

  const personnelListWithStatus = useMemo(() => {
    return personnels.map(p => ({
      ...p,
      onlineStatus: personnelStatuses[p.customer_id]?.status ?? 'offline',
    }));
  }, [personnels, personnelStatuses]);

  const handleEditClick = (personnel) => {
    setSelectedPersonnel({ ...personnel });
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedPersonnel(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPersonnel(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedPersonnel) return;
    setIsSubmitting(true);
    try {
      const response = await personnelService.updatePersonnel(selectedPersonnel.tckn, selectedPersonnel);
      setPersonnels(prev => prev.map(p => (p.customer_id === response.data.customer_id ? response.data : p)));
      setNotification({ open: true, message: response.message, severity: 'success' });
      handleCloseModal();
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: 'error' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSwitchChange = (personnel) => {
    setPersonnelToToggle(personnel);
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!personnelToToggle) return;
    setIsSubmitting(true);
    try {
      await personnelService.requestToggleOtp(personnelToToggle.tckn);
      setConfirmModalOpen(false);
      setTimer(180);
      setOtpModalOpen(true);
      setNotification({ open: true, message: 'Onay kodu oluşturuldu. Lütfen terminali kontrol edin.', severity: 'info' });
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!personnelToToggle || !otp) return;
    setIsSubmitting(true);
    try {
      const response = await personnelService.confirmStatusChange(personnelToToggle.tckn, otp);
      setPersonnels(prev => prev.map(p => p.tckn === response.data.tckn ? { ...p, is_active: response.data.is_active } : p));
      setNotification({ open: true, message: response.message, severity: 'success' });
      handleCloseOtpModal();
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setPersonnelToToggle(null);
  };
  
  const handleCloseOtpModal = () => {
    setOtpModalOpen(false);
    setPersonnelToToggle(null);
    setOtp('');
    setTimer(180);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
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
        <Alert severity="error">{error}</Alert>
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
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Personel Yönetimi</Typography>
              <Typography variant="body1" color="text.secondary">Sistemde kayıtlı {personnelListWithStatus.length} personel bulunmaktadır.</Typography>
            </Box>
          </Stack>
          <Button variant="contained" component={RouterLink} to="/admin/personnel/new" startIcon={<AddCircleOutline />} sx={{ py: 1.5, px: 3, borderRadius: '12px' }}>Yeni Personel Ekle</Button>
        </Stack>

        {personnelListWithStatus.length > 0 ? (
          <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <TableContainer>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead><TableRow sx={{ bgcolor: 'grey.100' }}>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>Personel No</TableCell>
                    <TableCell>TCKN</TableCell>
                    <TableCell>E-posta</TableCell>
                    <TableCell>Telefon</TableCell>
                    <TableCell align="center">Durum</TableCell>
                    <TableCell align="center">İşlemler</TableCell>
                </TableRow></TableHead>
                <TableBody>
                  {personnelListWithStatus.map((personnel) => (
                    <TableRow key={personnel.customer_id} hover>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" ownerState={{ status: personnel.onlineStatus }}/>
                          <Typography variant="body2">{`${personnel.first_name} ${personnel.last_name}`}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{personnel.username}</TableCell>
                      <TableCell>{personnel.tckn}</TableCell>
                      <TableCell>{personnel.email || '-'}</TableCell>
                      <TableCell>{personnel.phone_number || '-'}</TableCell>
                      <TableCell align="center">
                         <FormControlLabel control={<Switch checked={personnel.is_active === 1} onChange={() => handleSwitchChange(personnel)} color="success"/>}
                          label={personnel.is_active === 1 ? 'Aktif' : 'Pasif'} />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Düzenle">
                          <IconButton color="primary" onClick={() => handleEditClick(personnel)}><Edit /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ textAlign: 'center', py: 8, borderRadius: '16px', borderColor: 'divider' }}>
            <PeopleOutline sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Sistemde Kayıtlı Personel Bulunmuyor</Typography>
          </Paper>
        )}
      </Container>
      
      {selectedPersonnel && (
        <Dialog open={editModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle>Personel Bilgilerini Düzenle</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <TextField label="Ad" name="first_name" value={selectedPersonnel.first_name} onChange={handleInputChange} fullWidth />
              <TextField label="Soyad" name="last_name" value={selectedPersonnel.last_name} onChange={handleInputChange} fullWidth />
              <TextField label="E-posta" name="email" value={selectedPersonnel.email || ''} onChange={handleInputChange} fullWidth />
              <TextField label="Telefon Numarası" name="phone_number" value={selectedPersonnel.phone_number || ''} onChange={handleInputChange} fullWidth />
              <TextField label="Doğum Tarihi" name="birth_date" type="date" value={formatDate(selectedPersonnel.birth_date)} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} />
              <TextField label="Adres" name="address" value={selectedPersonnel.address || ''} onChange={handleInputChange} fullWidth multiline rows={3} />
              <TextField label="Şube Kodu" name="branch_code" value={selectedPersonnel.branch_code || ''} onChange={handleInputChange} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>İptal</Button>
            <Button onClick={handleUpdate} variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={confirmModalOpen} onClose={handleCloseConfirmModal}>
        <DialogTitle>İşlem Onayı</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {personnelToToggle && `${personnelToToggle.first_name} ${personnelToToggle.last_name}`} isimli personelin durumunu 
            ({personnelToToggle?.is_active === 1 ? 'Pasif' : 'Aktif'} hale getirmek) 
            değiştirmek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmModal}>İptal</Button>
          <Button onClick={handleConfirmAction} color="primary" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Evet, Eminim'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={otpModalOpen} onClose={handleCloseOtpModal}>
        <DialogTitle>Onay Kodu Girişi</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Bu kritik işlemi tamamlamak için lütfen size iletilen 6 haneli onay kodunu girin.
          </DialogContentText>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, color: 'text.secondary' }}>
            <Timer fontSize="small" />
            <Typography variant="body2">Kalan Süre: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</Typography>
          </Stack>
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
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpModal}>İptal</Button>
          <Button onClick={handleOtpSubmit} color="primary" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Onayla'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;