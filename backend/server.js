import express from 'express';
import http from 'http';
import { URL } from 'url';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js'; 
import customerRoutes from './routes/customer.routes.js';
import accountRoutes from './routes/account.routes.js';
import customerAuthRoutes from './routes/customerRoutes/auth.routes.js';
import customerAccountRoutes from './routes/customerRoutes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import customerNotificationRoutes from './routes/customerRoutes/notification.routes.js';
import customerTransactionRoutes from './routes/customerRoutes/transaction.routes.js';
import adminRoutes from './routes/adminRoutes/personnel.routes.js';
import wss from './websocket/websocketServer.js';
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

const SALT_ROUNDS = 10;
const password = '123456';
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/accounts', accountRoutes); 
app.use('/api/customers/auth', customerAuthRoutes); 
app.use('/api/customers/accounts', customerAccountRoutes); 
app.use('/api/customers/notifications', customerNotificationRoutes);
app.use('/api/customers/transactions', customerTransactionRoutes);

app.use('/api/customers', customerRoutes); 
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin/personnel', adminRoutes);

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
  try {
    const { pathname, searchParams } = new URL(request.url, `http://${request.headers.host}`);
    
    if (pathname === '/') {
      const token = searchParams.get('token');
      if (!token) {
        socket.destroy();
        return;
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const entityId = decoded.id || decoded.customerId;

      if (!entityId) {
        throw new Error('Token does not contain a valid ID.');
      }
      
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, entityId);
      });
    } else {
      socket.destroy();
    }
  } catch (err) {
    console.error('WebSocket Upgrade Error:', err.message);
    socket.destroy();
  }
});
server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});