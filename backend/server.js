import express from 'express';
import http from 'http';
import { URL } from 'url';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import wss from './websocket/websocketServer.js';

// Rotalarınızı ve diğer importlarınızı buraya ekleyin
import authRoutes from './routes/auth.routes.js'; 
import customerRoutes from './routes/customer.routes.js';
import accountRoutes from './routes/account.routes.js';
import customerAuthRoutes from './routes/customerRoutes/auth.routes.js';
import customerAccountRoutes from './routes/customerRoutes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import customerNotificationRoutes from './routes/customerRoutes/notification.routes.js';
import customerTransactionRoutes from './routes/customerRoutes/transaction.routes.js';
import adminRoutes from './routes/adminRoutes/personnel.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

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
  
  const { pathname, searchParams } = new URL(request.url, `http://${request.headers.host}`);
  const token = searchParams.get('token');

  if (!token) {
    console.error('[Upgrade] Hata: İstekte token bulunamadı. Bağlantı sonlandırılıyor.');
    socket.destroy();
    return;
  }
  
//  console.log('[Upgrade] Gelen Token:', token.substring(0, 20) + '...');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('[Upgrade] Hata: JWT doğrulama başarısız oldu.', err.message);
      socket.destroy();
      return;
    }

    //console.log('[Upgrade] Token başarıyla doğrulandı. Çözümlenen Payload:', decoded);

    if (!decoded.id || !decoded.role) {
      console.error('[Upgrade] Hata: Token gerekli alanları (id, role) içermiyor. Bağlantı sonlandırılıyor.');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
   //   console.log('[Upgrade] Bağlantı WebSocket sunucusuna devrediliyor.');
      wss.emit('connection', ws, request, decoded);
    });
  });
});


server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});