import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendPasswordResetCode } from "../../utils/emailService.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60; // 15 dakika


export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Kullanıcı adı ve şifre zorunludur.',
    });
  }

  const attemptKey = `login_attempts:personnel:${username}`;

  try {
    const attempts = await redisClient.get(attemptKey);
    if (attempts && parseInt(attempts, 10) >= MAX_LOGIN_ATTEMPTS) {
        return res.status(429).json({
            success: false,
            message: `Çok fazla hatalı deneme. Lütfen ${LOCK_TIME / 60} dakika sonra tekrar deneyin.`,
        });
    }

    const sql = `
      SELECT customer_id, first_name, last_name, username, password_hash, role, branch_code 
      FROM customers 
      WHERE username = ? AND (role = 'PERSONNEL' OR role = 'ADMIN')
    `;
    const [rows] = await pool.query(sql, [username]);
    const user = rows[0]; 

    if (!user || !user.password_hash) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      const newAttempts = await redisClient.incr(attemptKey);
      if (newAttempts === 1) {
          await redisClient.expire(attemptKey, LOCK_TIME);
      }
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    await redisClient.del(attemptKey);

    // Payload'a kullanıcının tüm bilgilerini ekliyoruz. Rol zaten dahil.
    const payload = {
      id: user.customer_id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role, // Bu çok önemli!
      branch_code: user.branch_code
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı!',
      token: token,
    });

  } catch (error) {
    console.error('Login sırasında hata:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    });
  }
};

export const logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Çıkış başarılı.' });
};

const RESET_CODE_EXPIRATION = 3 * 60; // 3 dakika
const TEMP_TOKEN_EXPIRATION = '15m'; // 15 dakika


export const requestPasswordReset = async (req, res) => {
  console.log("Şifre sıfırlama isteği geldi. Body:", req.body);
  const { username, tckn, email } = req.body;

  if (!username || !tckn || !email) {
    return res.status(400).json({ success: false, message: "Tüm alanlar zorunludur." });
  }

  try {
   
    const sql = `
      SELECT customer_id, email 
      FROM customers 
      WHERE username = ? AND tckn = ? AND email = ? AND role = 'ADMIN'
    `;
    const [rows] = await pool.query(sql, [username, tckn, email]);
    const user = rows[0];

    // Kullanıcı bulunamazsa veya bilgiler eşleşmezse, güvenlik için genel bir mesaj döndür.
    // Bu, hangi bilginin yanlış olduğunu sızdırmayı önler.
    if (!user) {
      return res.status(404).json({ success: false, message: "Girilen bilgilerle eşleşen bir admin hesabı bulunamadı." });
    }

    // 6 haneli rastgele bir kod oluştur
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `reset_code:admin:${username}`;

    // Kodu Redis'e 3 dakikalık geçerlilik süresiyle kaydet
    await redisClient.set(redisKey, resetCode, 'EX', RESET_CODE_EXPIRATION);
    
    // E-posta ile kodu gönder
    await sendPasswordResetCode(user.email, resetCode);

    res.status(200).json({
      success: true,
      message: "Bilgileriniz doğruysa, e-posta adresinize bir sıfırlama kodu gönderilmiştir."
    });

  } catch (error) {
    console.error('Şifre sıfırlama talebi sırasında hata:', error);
    res.status(500).json({ success: false, message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

/**
 * Adım 2: Kullanıcının girdiği sıfırlama kodunu doğrular.
 */
export const verifyResetCode = async (req, res) => {
  const { username, resetCode } = req.body;

  if (!username || !resetCode) {
    return res.status(400).json({ success: false, message: "Kullanıcı adı ve sıfırlama kodu zorunludur." });
  }

  const redisKey = `reset_code:admin:${username}`;

  try {
    const storedCode = await redisClient.get(redisKey);

    if (!storedCode) {
      return res.status(400).json({ success: false, message: "Kod geçersiz veya süresi dolmuş. Lütfen yeni bir kod talep edin." });
    }

    if (storedCode !== resetCode) {
      return res.status(400).json({ success: false, message: "Girilen kod hatalı." });
    }

    // Kod doğruysa, kodu Redis'ten silerek tekrar kullanılmasını engelle
    await redisClient.del(redisKey);

    // Kullanıcıya şifresini değiştirmesi için kısa süreli bir token oluştur
    const tempPayload = { username, purpose: 'password-reset' };
    const tempToken = jwt.sign(tempPayload, process.env.JWT_SECRET, { expiresIn: TEMP_TOKEN_EXPIRATION });

    res.status(200).json({
      success: true,
      message: "Kod doğrulandı. Şimdi yeni şifrenizi belirleyebilirsiniz.",
      resetToken: tempToken
    });

  } catch (error) {
    console.error('Sıfırlama kodu doğrulanırken hata:', error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

/**
 * Adım 3: Yeni şifreyi ayarlar.
 */
export const resetPassword = async (req, res) => {
  const { newPassword, resetToken } = req.body;

  if (!newPassword || !resetToken) {
    return res.status(400).json({ success: false, message: "Yeni şifre ve token zorunludur." });
  }

  try {
    // Geçici token'ı doğrula
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    // Token'ın doğru amaçla oluşturulduğundan emin ol
    if (decoded.purpose !== 'password-reset') {
        return res.status(401).json({ success: false, message: "Geçersiz token." });
    }

    const { username } = decoded;

    // Yeni şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Veritabanında şifreyi güncelle
    const sql = `UPDATE customers SET password_hash = ? WHERE username = ? AND role = 'ADMIN'`;
    const [result] = await pool.query(sql, [hashedPassword, username]);

    if (result.affectedRows === 0) {
      // Bu durum normalde yaşanmamalı ama bir güvenlik katmanı olarak ekleyebiliriz.
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ success: true, message: "Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz." });

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ success: false, message: "Şifre sıfırlama oturumunuzun süresi doldu. Lütfen tekrar deneyin." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ success: false, message: "Geçersiz token." });
    }
    console.error('Şifre sıfırlanırken hata:', error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};