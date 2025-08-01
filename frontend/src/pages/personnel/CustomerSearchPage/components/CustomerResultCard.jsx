import { Box, Button, Card, CardContent, CircularProgress, Divider, Grid, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CustomerResultCard = ({
  customer,
  isEditing,
  onEditToggle,
  onUpdate,
  onFieldChange,
  editableCustomer,
  isUpdating,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const displayDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <Card sx={{ mt: 4, width: '100%', textAlign: 'left' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            Müşteri Kişisel Bilgileri
          </Typography>
          <Box>
            {isEditing ? (
              <>
                <Button variant="contained" color="success" startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} onClick={onUpdate} disabled={isUpdating} sx={{ mr: 1 }}>
                  Kaydet
                </Button>
                <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={onEditToggle} disabled={isUpdating}>
                  İptal
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<EditIcon />} onClick={onEditToggle}>
                Düzenle
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {isEditing ? (
            <>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Ad" name="first_name" value={editableCustomer.first_name} onChange={onFieldChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Soyad" name="last_name" value={editableCustomer.last_name} onChange={onFieldChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="TCKN" name="tckn" value={editableCustomer.tckn} disabled /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Doğum Tarihi" name="birth_date" type="date" value={formatDate(editableCustomer.birth_date)} onChange={onFieldChange} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Telefon" name="phone_number" value={editableCustomer.phone_number} onChange={onFieldChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="E-posta" name="email" type="email" value={editableCustomer.email} onChange={onFieldChange} /></Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={6}><Typography color="text.secondary" variant="caption">Ad Soyad</Typography><Typography variant="body1">{`${customer.first_name} ${customer.last_name}`}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography color="text.secondary" variant="caption">TCKN</Typography><Typography variant="body1">{customer.tckn}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography color="text.secondary" variant="caption">Doğum Tarihi</Typography><Typography variant="body1">{displayDate(customer.birth_date)}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography color="text.secondary" variant="caption">Cinsiyet</Typography><Typography variant="body1">{customer.gender === 'E' ? 'Erkek' : 'Kadın'}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography color="text.secondary" variant="caption">Telefon</Typography><Typography variant="body1">{customer.phone_number || 'N/A'}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography color="text.secondary" variant="caption">E-posta</Typography><Typography variant="body1">{customer.email || 'N/A'}</Typography></Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CustomerResultCard;