import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60; // 15 dakika

export const register = async (req, res) => {
  const { username, password, first_name, last_name, branch_code } = req.body;

  if (!username || !password || !first_name || !last_name || !branch_code) {
    return res.status(400).json({
      success: false,
      message: 'Tüm alanlar (Kullanıcı Adı, Şifre, Ad, Soyad, Şube Kodu) zorunludur.',
    });
  }

  try {
    const [existingUser] = await pool.query("SELECT customer_id FROM customers WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Bu kullanıcı adı zaten mevcut.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const insertSql = `
        INSERT INTO customers (first_name, last_name, username, password_hash, branch_code, role) 
        VALUES (?, ?, ?, ?, ?, 'PERSONNEL')
    `;
    await pool.query(insertSql, [first_name, last_name, username, hashedPassword, branch_code]);
    
    res.status(201).json({
      success: true,
      message: 'Personel başarıyla kaydedildi!'
    });

  } catch (error) {
     console.error('Register sırasında hata:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Kayıt işlemi başarısız oldu.',
    });
  }
};

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

    // SQL SORGUSUNA first_name ve last_name ALANLARINI EKLE
    const sql = "SELECT customer_id, first_name, last_name, username, password_hash, role, branch_code FROM customers WHERE username = ? AND role = 'PERSONNEL'";
    const [rows] = await pool.query(sql, [username]);
    const personnel = rows[0];

    if (!personnel || !personnel.password_hash) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, personnel.password_hash);
    if (!isPasswordMatch) {
      const newAttempts = await redisClient.incr(attemptKey);
      if (newAttempts === 1) {
          await redisClient.expire(attemptKey, LOCK_TIME);
      }
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }

    await redisClient.del(attemptKey);

    // PAYLOAD'A first_name ve last_name'i EKLE
    const payload = {
      id: personnel.customer_id,
      username: personnel.username,
      first_name: personnel.first_name,
      last_name: personnel.last_name,
      role: personnel.role,
      branch_code: personnel.branch_code
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