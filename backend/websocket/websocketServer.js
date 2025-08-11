import { WebSocketServer, WebSocket } from 'ws';
import pool from '../config/db.js';

const connectedUsers = new Map();
const customerClients = new Map();
const staffStatus = new Map();

const wss = new WebSocketServer({ noServer: true });

const broadcastToStaff = (data) => {
  const message = JSON.stringify(data);
  for (const userSocket of connectedUsers.values()) {
    if ((userSocket.user.role === 'ADMIN' || userSocket.user.role === 'PERSONNEL') && userSocket.ws.readyState === WebSocket.OPEN) {
      userSocket.ws.send(message);
    }
  }
};

export const sendMessageToUser = (userId, data) => {
  const userSocket = connectedUsers.get(String(userId));
  if (userSocket && userSocket.ws.readyState === WebSocket.OPEN) {
    userSocket.ws.send(JSON.stringify(data));
    console.log(`WebSocket | Kullanıcıya özel mesaj gönderildi: ID=${userId}`, data);
    return true;
  }
  return false;
};

export const broadcastToCustomer = (customerId, data) => {
  const clientWs = customerClients.get(String(customerId));
  if (clientWs && clientWs.readyState === WebSocket.OPEN) {
    clientWs.send(JSON.stringify(data));
    console.log(`WebSocket | Müşteriye mesaj gönderildi: ID=${customerId}`, data);
    return true;
  }
  return false;
};

wss.on('connection', (ws, request, decodedToken) => {
  const { id, role, name, username } = decodedToken;
  const entityId = String(id);

  ws.user = decodedToken;

  console.log(`WebSocket | Yeni bağlantı: ID=${entityId}, Rol=${role}`);

  if (role === 'ADMIN' || role === 'PERSONNEL') {
    if (connectedUsers.has(entityId)) {
      connectedUsers.get(entityId).ws.terminate();
    }
    connectedUsers.set(entityId, { ws, user: decodedToken });
    console.log(`WebSocket | ${role} bağlandı: ${name}. Toplam bağlı personel/admin: ${connectedUsers.size}`);

    staffStatus.set(entityId, { id, name, username, status: 'online', role });
    broadcastToStaff({
      type: 'STAFF_STATUS_UPDATE',
      payload: staffStatus.get(entityId)
    });

    ws.send(JSON.stringify({
      type: 'INITIAL_STAFF_STATUS',
      payload: Array.from(staffStatus.values())
    }));

  } else if (role === 'CUSTOMER') {
    customerClients.set(entityId, ws);
    console.log(`WebSocket | Müşteri bağlandı: ${entityId}. Toplam müşteri: ${customerClients.size}`);
    ws.send(JSON.stringify({
      type: 'CONNECTION_SUCCESSFUL',
      payload: { message: `Hoşgeldiniz, müşteri ${entityId}!` }
    }));
  }

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'SEND_CHAT_MESSAGE') {
        const { receiverId, content } = data.payload;
        const senderId = ws.user.id;

        if (!receiverId || !content) return;

        const sql = `
          INSERT INTO chat_messages (sender_id, receiver_id, message_content)
          VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(sql, [senderId, receiverId, content]);
        const [rows] = await pool.query('SELECT * FROM chat_messages WHERE message_id = ?', [result.insertId]);
        const newDbMessage = rows[0];

        sendMessageToUser(receiverId, {
          type: 'NEW_CHAT_MESSAGE',
          payload: newDbMessage
        });

        ws.send(JSON.stringify({
          type: 'MESSAGE_SENT_CONFIRMATION',
          payload: newDbMessage
        }));
      }
    } catch (error) {
      console.error(`WebSocket | Mesaj işlenirken hata (ID=${ws.user.id}):`, error);
    }
  });

  ws.on('close', () => {
    console.log(`WebSocket | Bağlantı kapandı: ID=${entityId}, Rol=${role}`);
    if (role === 'ADMIN' || role === 'PERSONNEL') {
      connectedUsers.delete(entityId);
      
      const staffData = staffStatus.get(entityId);
      if (staffData) {
          staffStatus.set(entityId, { ...staffData, status: 'offline' });
          broadcastToStaff({
              type: 'STAFF_STATUS_UPDATE',
              payload: staffStatus.get(entityId)
          });
      }

    } else if (role === 'CUSTOMER') {
      customerClients.delete(entityId);
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket | Hata oluştu (ID=${entityId}):`, error);
  });
});

export default wss;