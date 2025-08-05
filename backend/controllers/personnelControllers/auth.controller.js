import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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