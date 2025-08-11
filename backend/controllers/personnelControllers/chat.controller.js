import pool from "../../config/db.js";
import { sendMessageToUser } from "../../websocket/websocketServer.js";



export const getChatHistory = async (req, res) => {
  const myId = req.user.id;
  const { contactId } = req.params;

  // 1. Frontend'den sayfa numarasını ve sayfa başına limit'i alalım.
  // Sayfa numarası gelmezse varsayılan olarak 1. sayfa kabul edilsin.
  const page = parseInt(req.query.page || '1', 10);
  const limit = 30; // Her istekte 30 mesaj getirilecek.
  const offset = (page - 1) * limit; // Veritabanında atlanacak kayıt sayısı.

  try {
    // 2. Toplam mesaj sayısını almak için ayrı bir sorgu çalıştıralım.
    // Bu, frontend'in toplam sayfa sayısını bilmesi ve daha fazla mesaj olup olmadığını anlaması için gereklidir.
    const countSql = `
      SELECT COUNT(*) as totalMessages
      FROM chat_messages
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    `;
    const [countResult] = await pool.query(countSql, [myId, contactId, contactId, myId]);
    const totalMessages = countResult[0].totalMessages;
    const totalPages = Math.ceil(totalMessages / limit);

    // 3. Belirtilen sayfa için mesajları getiren ana sorgu.
    // ORDER BY DESC: En yeni mesajların önce gelmesini sağlar.
    // LIMIT/OFFSET: Sayfalama işlemini gerçekleştirir.
    const messagesSql = `
      SELECT message_id, sender_id, receiver_id, message_content, created_at, is_read
      FROM chat_messages
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at DESC
      LIMIT ?
      OFFSET ?
    `;
    const [messages] = await pool.query(messagesSql, [myId, contactId, contactId, myId, limit, offset]);

    // Frontend, mesajları en yeniden eskiye doğru alır.
    // Genellikle chat arayüzlerinde bu liste ters çevrilerek (veya başa eklenerek) gösterilir.
    res.status(200).json({
      success: true,
      messages: messages, // İstenen 30 mesaj
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalMessages: totalMessages,
        hasNextPage: page < totalPages
      }
    });

  } catch (error) {
    console.error('Sohbet geçmişi alınırken hata:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};



export const markMessagesAsRead = async (req, res) => {
  const receiverId = req.user.id;
  const { senderId } = req.body; 

  if (!senderId) {
    return res.status(400).json({ success: false, message: 'Gönderen ID bilgisi zorunludur.' });
  }

  try {
    const sql = `
      UPDATE chat_messages 
      SET is_read = TRUE 
      WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE
    `;
    await pool.query(sql, [receiverId, senderId]);
    
    const notificationPayload = {
      type: 'MESSAGES_READ',
      payload: {
        chatPartnerId: receiverId, 
      }
    };
    sendMessageToUser(senderId, notificationPayload);

    res.status(200).json({ success: true, message: 'Mesajlar okundu olarak işaretlendi.' });

  } catch (error) {
    console.error('Mesajlar okundu olarak işaretlenirken hata:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

export const getChatContacts = async (req, res) => {
  const myId = req.user.id;

  try {
    const sql = `
      SELECT customer_id as id, username, first_name, last_name, role 
      FROM customers 
      WHERE (role = 'ADMIN' OR role = 'PERSONNEL') AND customer_id != ?
      ORDER BY first_name, last_name
    `;
    const [contacts] = await pool.query(sql, [myId]);
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error('Sohbet kişileri alınırken hata:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};