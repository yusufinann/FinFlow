import React, { useState } from 'react';
import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import ChatWindow from '../components/chat/ChatWindow';
import ContactList from '../components/chat/ContactList';

const ChatPage = () => {
  const [selectedContactId, setSelectedContactId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ height: 'calc(100vh - 150px)',mt:1 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.default'
        }}
      >
        <Box 
          sx={{
            width: { xs: '100%', md: 1/3, lg: 1/4 },
            display: selectedContactId && isMobile ? 'none' : 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRight: { xs: 'none', md: '1px solid' },
            borderColor: 'divider',
          }}
        >
          <ContactList 
            selectedContactId={selectedContactId} 
            setSelectedContactId={setSelectedContactId} 
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1, 
            display: !selectedContactId && isMobile ? 'none' : 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <ChatWindow 
            contactId={selectedContactId}
            onBack={() => setSelectedContactId(null)}
            showBackButton={isMobile}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;