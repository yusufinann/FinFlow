import { WebSocketServer } from 'ws';

// Müşterileri, Adminleri ve Personel Durumlarını takip etmek için ayrı haritalar
const customerClients = new Map();
const adminClients = new Map();
const personnelStatus = new Map(); // Key: personnelId, Value: { status, name, username }

const wss = new WebSocketServer({ noServer: true });

// Tüm bağlı adminlere yayın yapan yardımcı fonksiyon
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

  // Rolüne göre bağlantıyı işle
  if (role === 'ADMIN') {
    adminClients.set(entityId, ws);
    console.log(`WebSocket | Admin bağlandı: ${entityId}. Toplam admin: ${adminClients.size}`);
    
    // Yeni bağlanan admine mevcut tüm personellerin durumunu gönder
    ws.send(JSON.stringify({
      type: 'INITIAL_PERSONNEL_STATUS',
      payload: Array.from(personnelStatus.values())
    }));

  } else if (role === 'PERSONNEL') {
    // Aynı personelin eski bağlantısı varsa sonlandır
    if (personnelStatus.has(entityId)) {
        const oldClient = [...wss.clients].find(client => client.personnelId === entityId);
        if (oldClient) oldClient.terminate();
    }
    
    ws.personnelId = entityId; // ws nesnesine ID ekleyerek kolayca bulabiliriz
    personnelStatus.set(entityId, { id: entityId, name, username, status: 'online' });
    console.log(`WebSocket | Personel bağlandı: ${entityId} - ${name}`);

    // Tüm adminlere personelin online olduğunu bildir
    broadcastToAdmins({
      type: 'PERSONNEL_STATUS_UPDATE',
      payload: personnelStatus.get(entityId)
    });

  } else if (role === 'CUSTOMER') {
    customerClients.set(entityId, ws);
    // Mevcut müşteri mantığınız
  }

  ws.on('close', () => {
    console.log(`WebSocket | Bağlantı kapandı: ID=${entityId}, Rol=${role}`);
    if (role === 'ADMIN') {
      adminClients.delete(entityId);
      console.log(`WebSocket | Admin ayrıldı: ${entityId}. Kalan admin: ${adminClients.size}`);
    } else if (role === 'PERSONNEL') {
      personnelStatus.set(entityId, { ...personnelStatus.get(entityId), status: 'offline' });
      // Tüm adminlere personelin offline olduğunu bildir
      broadcastToAdmins({
        type: 'PERSONNEL_STATUS_UPDATE',
        payload: personnelStatus.get(entityId)
      });
      console.log(`WebSocket | Personel ayrıldı: ${entityId} - ${name}`);
    } else if (role === 'CUSTOMER') {
      customerClients.delete(entityId);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket | Hata oluştu (ID=${entityId}):`, error);
  });
});

// Müşteriye bildirim gönderme fonksiyonu (mevcut)
export const broadcastToCustomer = (customerId, data) => {
  const clientWs = customerClients.get(String(customerId));
  if (clientWs && clientWs.readyState === clientWs.OPEN) {
    clientWs.send(JSON.stringify(data));
    return true;
  }
  return false;
};

export default wss;