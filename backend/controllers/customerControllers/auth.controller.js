import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60; 

export const login = async (req, res) => {
    const { customer_number, password } = req.body;

    if (!customer_number || !password) {
        return res.status(400).json({
            success: false,
            message: 'Müşteri numarası ve şifre zorunludur.'
        });
    }

    const attempKey = `login_attempts:${customer_number}`;

    try {
        const attempts = await redisClient.get(attempKey);
        if (attempts && parseInt(attempts, 10) >= MAX_LOGIN_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: `Çok fazla hatalı deneme. Lütfen ${LOCK_TIME / 60} dakika sonra tekrar deneyin.`,
            });
        }

        const sql = "SELECT customer_id, customer_number, first_name, last_name, password_hash, is_active FROM customers WHERE customer_number = ?";
        const [rows] = await pool.query(sql, [customer_number]);
        const customer = rows[0];

        if (!customer || !customer.password_hash) {
            // Hatalı deneme sayısını artırarak kullanıcı enumeration saldırılarını önle
            const newAttempts = await redisClient.incr(attempKey);
            if (newAttempts === 1) {
                await redisClient.expire(attempKey, LOCK_TIME);
            }
            return res.status(401).json({
                success: false,
                message: "Müşteri numarası veya şifre hatalı.",
            });
        }

         if (customer.is_active === 0) {
            return res.status(403).json({ 
                success: false,
                message: "Hesabınız pasif durumdadır. Hesabınızı aktifleştirmek için lütfen şubenizle iletişime geçin.",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, customer.password_hash);

        if (!isPasswordMatch) {
            const newAttempts = await redisClient.incr(attempKey);
            if (newAttempts === 1) {
                await redisClient.expire(attempKey, LOCK_TIME);
            }
            return res.status(401).json({
                success: false,
                message: "Müşteri numarası veya şifre hatalı.",
            });
        }

        await redisClient.del(attempKey);

        const payload = {
            id: customer.customer_id,
            customerNumber: customer.customer_number,
            role: 'CUSTOMER',
            fullName: `${customer.first_name} ${customer.last_name}`,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            success: true,
            message: 'Giriş başarılı!',
            token: token,
            customer: {
                id: customer.customer_id,
                customerNumber: customer.customer_number,
                fullName: `${customer.first_name} ${customer.last_name}`,
            }
        });

    } catch (error) {
        console.error("An error occurred during login:", error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        });
    }
};

export const getCustomerProfile = async (req, res) => {
    const customerId = req.user.id; 

    try {
        const sql = `
            SELECT 
                customer_id, 
                customer_number, 
                first_name, 
                last_name, 
                email, 
                phone_number, 
                address,
                DATE_FORMAT(created_at, '%d-%m-%Y %H:%i') as member_since
            FROM customers 
            WHERE customer_id = ? AND is_active = 1
        `;
        const [rows] = await pool.query(sql, [customerId]);
        const profile = rows[0];

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Müşteri profili bulunamadı.",
            });
        }

        res.status(200).json({
            success: true,
            data: profile,
        });

    } catch (error) {
        console.error("Error fetching customer profile:", error);
        res.status(500).json({
            success: false,
            message: "Profil bilgileri alınırken bir sunucu hatası oluştu.",
        });
    }
};