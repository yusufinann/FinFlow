import { WebSocketServer } from 'ws';

const clients = new Map();

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, request, customerId) => {
  if (!customerId) {
    ws.close(1008, 'Authentication failed');
    return;
  }

  console.log(`WebSocket | Müşteri bağlandı: ${customerId}`);
  
  const stringCustomerId = String(customerId);

  if (clients.has(stringCustomerId)) {
      clients.get(stringCustomerId).terminate();
  }
  
  clients.set(stringCustomerId, ws);

  ws.on('message', (message) => {
    console.log(`WebSocket | Mesaj alındı (${stringCustomerId}): ${message}`);
  });

  ws.on('close', () => {
    console.log(`WebSocket | Müşteri bağlantısı kapandı: ${stringCustomerId}`);
    if (clients.get(stringCustomerId) === ws) {
        clients.delete(stringCustomerId);
    }
  });
  
  ws.on('error', (error) => {
    console.error(`WebSocket | Hata oluştu (${stringCustomerId}):`, error);
  });
});

export const broadcastToCustomer = (customerId, data) => {
  const stringCustomerId = String(customerId);
  const clientWs = clients.get(stringCustomerId);

  if (clientWs && clientWs.readyState === clientWs.OPEN) {
    console.log(`WebSocket | Bildirim gönderiliyor (${stringCustomerId}):`, data);
    clientWs.send(JSON.stringify(data));
    return true; 
  } else {
    console.log(`WebSocket | Müşteri bulunamadı veya bağlantı kapalı: ${stringCustomerId}`);
    return false; 
  }
};

export default wss;