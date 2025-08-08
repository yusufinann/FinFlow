import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { 
  Box, Typography, TextField, IconButton, Paper, Avatar, Chip, Fade, InputAdornment, Tooltip,
} from '@mui/material';
import { 
  Send as SendIcon, DoneAll as DoneAllIcon, ArrowBack as ArrowBackIcon, 
  AttachFile as AttachFileIcon, EmojiEmotions as EmojiIcon, MoreVert as MoreVertIcon 
} from '@mui/icons-material';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useWebSocket } from '../../shared/context/websocketContext';
import { usePersonnelAuth } from '../../shared/context/PersonnelAuthContext';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Dün';
  if (days < 7) return date.toLocaleDateString([], { weekday: 'long' });
  return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
};

const MessageRow = React.memo(({ index, style, data }) => {
  const { conversation, personnel, contact, setSize } = data;
  const msg = conversation[index];
  const prevMsg = conversation[index - 1];
  const isOwnMessage = msg.sender_id === personnel.id;
  const showDateDivider = !prevMsg || new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();
  
  const rowRef = useRef(null);
  useEffect(() => {
    if (rowRef.current) {
      const newSize = rowRef.current.getBoundingClientRect().height;
      setSize(index, newSize);
    }
  }, [setSize, index, rowRef]);

  return (
    <div style={style} ref={rowRef}>
      {showDateDivider && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Chip
            size="small"
            label={formatTime(msg.created_at)}
            sx={{ bgcolor: 'background.paper', color: 'text.secondary', fontSize: '0.75rem' }}
          />
        </Box>
      )}
      <Fade in timeout={300}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start', 
          mb: 1.5,
          px: 2,
          alignItems: 'flex-end'
        }}>
          {!isOwnMessage && (
            <Avatar sx={{ width: 32, height: 32, mr: 1, mb: 0.5 }} src={contact?.avatar}>
              {contact?.first_name?.[0]}
            </Avatar>
          )}
          <Paper
            elevation={isOwnMessage ? 2 : 1}
            sx={{
              p: 2,
              borderRadius: isOwnMessage ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
             bgcolor: isOwnMessage ? '#dcf8c6' : 'background.paper', 
    color: 'text.primary', 
              maxWidth: '75%',
              minWidth: '80px',
              position: 'relative'
            }}
          >
            <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
              {msg.message_content}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1, gap: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              {isOwnMessage && (
                <DoneAllIcon sx={{ fontSize: 16, color: msg.is_read ? 'info.light' : 'rgba(255,255,255,0.5)' }}/>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </div>
  );
});

const ChatWindow = ({ contactId, onBack, showBackButton }) => {
  const { messages, loadChatHistory, sendMessage, chatContacts, personnelStatuses } = useWebSocket();
  const { personnel } = usePersonnelAuth();
  const [newMessage, setNewMessage] = useState('');
  
  const listRef = useRef(null);
  const sizeMap = useRef({});

  const conversation = messages[contactId] || [];
  const contact = chatContacts.find(c => c.id === contactId);
  const isOnline = personnelStatuses[contactId]?.status === 'online';

  useEffect(() => {
    if (contactId) {
      loadChatHistory(contactId);
    }
    sizeMap.current = {};
    if(listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [contactId, loadChatHistory]);

  useEffect(() => {
    if (conversation.length > 0 && listRef.current) {
      listRef.current.scrollToItem(conversation.length - 1, 'end');
    }
  }, [conversation.length]);
  
  const setSize = useCallback((index, size) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      if(listRef.current) {
        listRef.current.resetAfterIndex(index);
      }
    }
  }, []);

  const getSize = useCallback(index => sizeMap.current[index] || 100, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() && contactId) {
      sendMessage(contactId, newMessage.trim());
      setNewMessage('');
    }
  };

  const itemData = useMemo(() => ({
    conversation,
    personnel,
    contact,
    setSize,
  }), [conversation, personnel, contact, setSize]);
  
  if (!contactId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: 120, height: 120, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
          <SendIcon sx={{ fontSize: 60 }} />
        </Box>
        <Typography variant="h5" color="text.secondary" fontWeight={300}>Mesajlaşmaya başlayın</Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center" maxWidth={300}>
          Sohbete başlamak için sol taraftan bir kişi seçin ve mesajlaşmaya başlayın.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
      <Paper elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }}>
        {showBackButton && <IconButton onClick={onBack} size="small"><ArrowBackIcon /></IconButton>}
        <Avatar sx={{ width: 45, height: 45, border: isOnline ? '3px solid' : 'none', borderColor: 'success.main' }}>
          {contact?.first_name?.[0]}{contact?.last_name?.[0]}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>{contact?.first_name} {contact?.last_name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip size="small" label={isOnline ? 'Çevrimiçi' : 'Çevrimdışı'} color={isOnline ? 'success' : 'default'} variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
            <Typography variant="caption" color="text.secondary">{contact?.role}</Typography>
          </Box>
        </Box>
        <IconButton size="small"><MoreVertIcon /></IconButton>
      </Paper>

      <Box sx={{ flexGrow: 1, bgcolor: 'grey.50',
        backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(0,0,0,0.02) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              width={width}
              itemCount={conversation.length}
              itemSize={getSize}
              itemData={itemData}
              overscanCount={5}
            >
              {MessageRow}
            </List>
          )}
        </AutoSizer>
      </Box>

      <Paper component="form" onSubmit={handleSend} elevation={0} sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <IconButton size="small" color="primary"><AttachFileIcon /></IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            size="small"
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            autoComplete="off"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.100', border: 'none', '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: '2px solid', borderColor: 'primary.main' }}}}
            InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton size="small"><EmojiIcon /></IconButton></InputAdornment>)}}
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }}}
          />
          <Tooltip title="Gönder">
            <IconButton 
              type="submit" 
              color="primary"
              disabled={!newMessage.trim()}
              sx={{ bgcolor: newMessage.trim() ? 'primary.main' : 'grey.300', color: 'white', '&:hover': { bgcolor: newMessage.trim() ? 'primary.dark' : 'grey.400' }, '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' }}}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatWindow;