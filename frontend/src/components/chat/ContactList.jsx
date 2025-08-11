import React, { useState } from 'react';
import { 
  ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, 
  Divider, Badge, Box, TextField, InputAdornment, Chip 
} from '@mui/material';
import { Search as SearchIcon, Circle as CircleIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useWebSocket } from '../../shared/context/websocketContext';

const StyledBadge = styled(Badge)(({ theme, ownerState }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: ownerState.status === 'online' ? '#44b700' : '#9e9e9e',
    color: ownerState.status === 'online' ? '#44b700' : '#9e9e9e',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
      animation: ownerState.status === 'online' ? 'ripple 1.2s infinite ease-in-out' : 'none',
      border: '1px solid currentColor', content: '""',
    },
  },
  '@keyframes ripple': { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.4)', opacity: 0 } },
}));

const ContactRow = ({ index, style, data }) => {
  const { contacts, selectedContactId, setSelectedContactId, getStatus, unreadMessages } = data;
  const contact = contacts[index];
  const isSelected = selectedContactId === contact.id;
  const isOnline = getStatus(contact.id) === 'online';
  const unreadCount = unreadMessages[contact.id] || 0;

  return (
    <div style={style}>
      <ListItemButton
        key={contact.id}
        selected={isSelected}
        onClick={() => setSelectedContactId(contact.id)}
        sx={(theme) => ({ 
          borderRadius: 2, 
          mb: 0.5, 
          mx: 1, 
          py: 1.5,
          borderRight: isSelected ? `4px solid ${theme.palette.error.main}` : '4px solid transparent',
          '&.Mui-selected': { 
            bgcolor: alpha(theme.palette.error.main, 0.08), 
            color: theme.palette.error.main, 
            '&:hover': { 
              bgcolor: alpha(theme.palette.error.main, 0.12) 
            } 
          },
          '&:hover': { 
            bgcolor: !isSelected ? alpha(theme.palette.grey[500], 0.08) : undefined
          }
        })}
      >
        <ListItemAvatar>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            ownerState={{ status: getStatus(contact.id) }}
          >
            <Avatar sx={{ width: 48, height: 48, bgcolor: isSelected ? 'error.main' : 'grey.500', color: 'white', fontWeight: 600 }}>
              {contact.first_name?.[0]}{contact.last_name?.[0]}
            </Avatar>
          </StyledBadge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={isSelected || unreadCount > 0 ? 600 : 500} color={isSelected ? 'inherit' : 'text.primary'} noWrap>
                {contact.first_name} {contact.last_name}
              </Typography>
              {unreadCount > 0 && (
                <Badge badgeContent={unreadCount} color="error" />
              )}
            </Box>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {contact.role}
              </Typography>
              {isOnline && <Typography variant="caption" color="success.main" fontWeight={500}>Aktif</Typography>}
            </Box>
          }
          primaryTypographyProps={{
            color: isSelected ? 'error.main' : 'text.primary',
            fontWeight: isSelected ? 'fontWeightBold' : 'fontWeightMedium'
          }}
        />
      </ListItemButton>
    </div>
  );
};

const ContactList = ({ selectedContactId, setSelectedContactId }) => {
  const { chatContacts, personnelStatuses, unreadMessages } = useWebSocket();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatus = (contactId) => personnelStatuses[contactId]?.status || 'offline';

  const filteredContacts = chatContacts.filter(contact =>
    `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineCount = chatContacts.filter(contact => getStatus(contact.id) === 'online').length;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">Mesajlar</Typography>
          <Chip
            size="small"
            icon={<CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />}
            label={`${onlineCount} çevrimiçi`}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
        <TextField
          fullWidth
          size="small"
          placeholder="Kişi ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="disabled" /></InputAdornment>)}}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.100', border: 'none', '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid', borderColor: 'error.main', bgcolor: 'background.paper' }}}}
        />
      </Box>

      <Divider />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemSize={84}
              itemCount={filteredContacts.length}
              itemData={{
                contacts: filteredContacts,
                selectedContactId,
                setSelectedContactId,
                getStatus,
                unreadMessages,
              }}
              overscanCount={5}
            >
              {ContactRow}
            </List>
          )}
        </AutoSizer>
      </Box>
      
      {filteredContacts.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Arama kriterlerinize uygun kişi bulunamadı.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ContactList;