import { WebSocketServer } from 'ws';

const customerClients = new Map();
const adminClients = new Map();
const personnelStatus = new Map();

const wss = new WebSocketServer({ noServer: true });

const broadcastToAdmins = (data) => {
  const message = JSON.stringify(data);
  console.log('WebSocket | Adminlere yayın yapılıyor:', data);
  for (const adminWs of adminClients.values()) {
    if (adminWs.readyState === adminWs.OPEN) {
      adminWs.send(message);
    }
  }
};

wss.on('connection', (ws, request, decodedToken) => {
  const { id, role, name, username } = decodedToken;
  const entityId = String(id);

  if (!entityId || !role) {
    ws.close(1008, 'Authentication failed: ID or role missing');
    return;
  }

  console.log(`WebSocket | Yeni bağlantı: ID=${entityId}, Rol=${role}`);

  if (role === 'ADMIN') {
    adminClients.set(entityId, ws);
    console.log(`WebSocket | Admin bağlandı: ${entityId}. Toplam admin: ${adminClients.size}`);
    
    ws.send(JSON.stringify({
      type: 'INITIAL_PERSONNEL_STATUS',
      payload: Array.from(personnelStatus.values())
    }));

  } else if (role === 'PERSONNEL') {
    if (personnelStatus.has(entityId)) {
        const oldClient = [...wss.clients].find(client => client.personnelId === entityId);
        if (oldClient) oldClient.terminate();
    }
    
    ws.personnelId = entityId;
    personnelStatus.set(entityId, { id: entityId, name, username, status: 'online' });
    console.log(`WebSocket | Personel bağlandı: ${entityId} - ${name}`);

    broadcastToAdmins({
      type: 'PERSONNEL_STATUS_UPDATE',
      payload: personnelStatus.get(entityId)
    });

  } else if (role === 'CUSTOMER') {
    customerClients.set(entityId, ws);
    console.log(`WebSocket | Müşteri bağlandı: ${entityId}. Toplam müşteri: ${customerClients.size}`);

    ws.send(JSON.stringify({
      type: 'CONNECTION_SUCCESSFUL',
      payload: { message: `Welcome, customer ${entityId}!` }
    }));
  }

  ws.on('close', () => {
    console.log(`WebSocket | Bağlantı kapandı: ID=${entityId}, Rol=${role}`);
    if (role === 'ADMIN') {
      adminClients.delete(entityId);
      console.log(`WebSocket | Admin ayrıldı: ${entityId}. Kalan admin: ${adminClients.size}`);
    } else if (role === 'PERSONNEL') {
      personnelStatus.set(entityId, { ...personnelStatus.get(entityId), status: 'offline' });
      broadcastToAdmins({
        type: 'PERSONNEL_STATUS_UPDATE',
        payload: personnelStatus.get(entityId)
      });
      console.log(`WebSocket | Personel ayrıldı: ${entityId} - ${name}`);
    } else if (role === 'CUSTOMER') {
      customerClients.delete(entityId);
      console.log(`WebSocket | Müşteri ayrıldı: ${entityId}. Kalan müşteri: ${customerClients.size}`);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket | Hata oluştu (ID=${entityId}):`, error);
  });
});

export const broadcastToCustomer = (customerId, data) => {
  const customerIdStr = String(customerId);
  console.log(`WebSocket | Müşteriye yayın deneniyor: ID=${customerIdStr}`);
  
  const clientWs = customerClients.get(customerIdStr);

  if (clientWs) {
    console.log(`WebSocket | Müşteri bağlantısı bulundu. Durum: ${clientWs.readyState === clientWs.OPEN ? 'AÇIK' : 'KAPALI'}`);
    if (clientWs.readyState === clientWs.OPEN) {
      clientWs.send(JSON.stringify(data));
      console.log(`WebSocket | Müşteriye mesaj gönderildi: ID=${customerIdStr}`, data);
      return true;
    }
  } else {
    console.log(`WebSocket | Müşteri bağlantısı BULUNAMADI: ID=${customerIdStr}. Müşteri çevrimdışı olabilir.`);
  }
  return false;
};

export default wss;