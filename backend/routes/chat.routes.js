import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js';
import { getChatHistory, markMessagesAsRead,getChatContacts } from '../controllers/personnelControllers/chat.controller.js';

const router = express.Router();

router.get('/contacts', authenticateUser, getChatContacts); 

router.get('/history/:contactId', authenticateUser, getChatHistory);

router.post('/mark-as-read', authenticateUser, markMessagesAsRead);


export default router;