import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendPasswordResetCode } from "../../utils/emailService.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60;
const RESET_CODE_EXPIRATION = 3 * 60;
const TEMP_TOKEN_EXPIRATION = '15m';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Kullanıcı adı ve şifre zorunludur.' });
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
      SELECT customer_id, first_name, last_name, username, password_hash, role, branch_code, is_active 
      FROM customers 
      WHERE username = ? AND (role = 'PERSONNEL' OR role = 'ADMIN')
    `;
    const [rows] = await pool.query(sql, [username]);
    const user = rows[0];

    if (!user || !user.password_hash) {
      const newAttempts = await redisClient.incr(attemptKey);
      if (newAttempts === 1) await redisClient.expire(attemptKey, LOCK_TIME);
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    if (user.is_active === 0) {
      return res.status(403).json({
        success: false,
        message: "Hesabınız pasif durumdadır. Lütfen bir yönetici ile iletişime geçin."
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      const newAttempts = await redisClient.incr(attemptKey);
      if (newAttempts === 1) await redisClient.expire(attemptKey, LOCK_TIME);
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    await redisClient.del(attemptKey);

    const payload = {
      id: user.customer_id,
      username: user.username,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role,
      branch_code: user.branch_code
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ success: true, message: 'Giriş başarılı!', token });
  } catch (error) {
    console.error('Login sırasında hata:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası.' });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Çıkış başarılı.' });
};

export const requestPasswordReset = async (req, res) => {
  const { username, tckn, email } = req.body;

  if (!username || !tckn || !email) {
    return res.status(400).json({ success: false, message: "Tüm alanlar zorunludur." });
  }

  try {
    const sql = `
      SELECT customer_id, email, role 
      FROM customers 
      WHERE username = ? AND tckn = ? AND email = ? AND (role = 'ADMIN' OR role = 'PERSONNEL')
    `;
    const [rows] = await pool.query(sql, [username, tckn, email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Girilen bilgilerle eşleşen bir yönetici veya personel hesabı bulunamadı." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (user.role === 'ADMIN') {
      const redisKey = `reset_code:admin:${username}`;
      await redisClient.set(redisKey, resetCode, 'EX', RESET_CODE_EXPIRATION);
      await sendPasswordResetCode(user.email, resetCode);
      
      return res.status(200).json({
        success: true,
        message: "Bilgileriniz doğruysa, e-posta adresinize bir sıfırlama kodu gönderilmiştir."
      });

    } else if (user.role === 'PERSONNEL') {
      const redisKey = `reset_code:personnel:${username}`;
      await redisClient.set(redisKey, resetCode, 'EX', RESET_CODE_EXPIRATION);
      
      console.log(`--- PERSONEL ŞİFRE SIFIRLAMA OTP SİMÜLASYONU ---`);
      console.log(`-> KULLANICI ADI: ${username}`);
      console.log(`-> ONAY KODU (OTP): ${resetCode}`);
      console.log(`-------------------------------------------------`);

      return res.status(200).json({
        success: true,
        message: "Onay kodu oluşturuldu ve 3 dakika geçerlidir. (Simülasyon)"
      });
    }

  } catch (error) {
    console.error('Şifre sıfırlama talebi sırasında hata:', error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

export const verifyResetCode = async (req, res) => {
  const { username, resetCode } = req.body;

  if (!username || !resetCode) {
    return res.status(400).json({ success: false, message: "Kullanıcı adı ve sıfırlama kodu zorunludur." });
  }

  try {
    const adminKey = `reset_code:admin:${username}`;
    const personnelKey = `reset_code:personnel:${username}`;

    let storedCode = await redisClient.get(adminKey);
    let userRole = 'ADMIN';
    let keyToDelete = adminKey;

    if (!storedCode) {
      storedCode = await redisClient.get(personnelKey);
      userRole = 'PERSONNEL';
      keyToDelete = personnelKey;
    }

    if (!storedCode || storedCode !== resetCode) {
      return res.status(400).json({ success: false, message: "Kod hatalı, geçersiz veya süresi dolmuş." });
    }

    await redisClient.del(keyToDelete);

    const tempPayload = { username, purpose: 'password-reset', role: userRole };
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

export const resetPassword = async (req, res) => {
  const { newPassword, resetToken } = req.body;

  if (!newPassword || !resetToken) {
    return res.status(400).json({ success: false, message: "Yeni şifre ve token zorunludur." });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    
    if (decoded.purpose !== 'password-reset' || !['ADMIN', 'PERSONNEL'].includes(decoded.role)) {
        return res.status(401).json({ success: false, message: "Geçersiz token." });
    }

    const { username, role } = decoded;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const sql = `UPDATE customers SET password_hash = ? WHERE username = ? AND role = ?`;
    await pool.query(sql, [hashedPassword, username, role]);

    res.status(200).json({ success: true, message: "Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz." });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ success: false, message: "Oturum geçersiz veya süresi dolmuş. Lütfen tekrar deneyin." });
    }
    console.error('Şifre sıfırlanırken hata:', error);
    res.status(500).json({ success: false, message: "Sunucu hatası." });
  }
};

export const getPersonnelProfile = async (req, res) => {
    const personnelId = req.user.id;

    try {
        const sql = `
            SELECT 
                customer_id,
                username,
                first_name,
                last_name,
                tckn,
                email,
                phone_number,
                address, 
                gender, 
                birth_date,
                role,
                branch_code,
                is_active,
                DATE_FORMAT(created_at, '%d-%m-%Y %H:%i') as member_since,
                DATE_FORMAT(updated_at, '%d-%m-%Y %H:%i') as last_update
            FROM customers 
            WHERE customer_id = ? AND (role = 'PERSONNEL' OR role = 'ADMIN')
        `;

        const [rows] = await pool.query(sql, [personnelId]);
        const profile = rows[0];

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Personel profili bulunamadı."
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        console.error("Profil bilgileri alınırken hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu."
        });
    }
};