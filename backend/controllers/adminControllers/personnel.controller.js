import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";

const OTP_EXPIRATION_SECONDS = 180;

const generateUniquePersonnelUsername = async () => {
    let username;
    let isUnique = false;
    while (!isUnique) {
        username = Math.floor(100000 + Math.random() * 900000).toString();
        const [rows] = await pool.query(
            "SELECT customer_id FROM customers WHERE username = ?",
            [username]
        );
        if (rows.length === 0) {
            isUnique = true;
        }
    }
    return username;
};

export const createPersonnel = async (req, res) => {
    const { tckn, first_name, last_name, branch_code, birth_date, gender, phone_number, email, address } = req.body;

    if (!tckn || !first_name || !last_name) {
        return res.status(400).json({
            success: false,
            message: "Ad, Soyad ve TCKN zorunludur.",
        });
    }
    try {
        const username = await generateUniquePersonnelUsername();
        const sql = `INSERT INTO customers (tckn, username, first_name, last_name, birth_date, gender, phone_number, email, address, branch_code, role)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PERSONNEL')`;

        const values = [tckn, username, first_name, last_name, birth_date || null,
            gender || null, phone_number || null, email || null, address || null, branch_code || null];
        
        const [result] = await pool.query(sql, values);

        res.status(201).json({
            success: true,
            message: "Personel başarıyla oluşturuldu.",
            data: {
                personnelId: result.insertId,
                username: username,
            }
        });

    } catch (error) {
        console.error("Personel oluşturma sırasında hata:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Bu TCKN, E-posta veya Telefon Numarası zaten kayıtlı.",
            });
        }
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
    }
};

export const getAllPersonnels = async (req, res) => {
    const sql = "SELECT customer_id, username, tckn, first_name, last_name, birth_date, gender, phone_number, email, address, branch_code, is_active FROM customers WHERE role = 'PERSONNEL' ORDER BY created_at DESC";
    try {
        const [rows] = await pool.query(sql);
        res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Personel bilgilerini alırken hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
    }
};

export const getPersonelByTckn = async (req, res) => {
    const { tckn } = req.params;

    if (!tckn) {
        return res.status(400).json({
            success: false,
            message: "TCKN zorunludur.",
        });
    }

    const personnelSql = "SELECT * FROM customers WHERE (tckn = ?) AND role = 'PERSONNEL'";

    try {
        const [personnelRows] = await pool.query(personnelSql, [tckn]);

        if (personnelRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bu TCKN ile kayıtlı bir personel bulunamadı.",
            });
        }
        res.status(200).json({
            success: true,
            data: personnelRows[0],
        });
    } catch (error) {
        console.error("Personel bilgilerini alırken hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
    }
};

export const updatePersonnel = async (req, res) => {
    const { tckn } = req.params;
    const {
        first_name,
        last_name,
        branch_code,
        birth_date,
        gender,
        phone_number,
        email,
        address
    } = req.body;

    if (!tckn) {
        return res.status(400).json({ success: false, message: "TCKN bilgisi zorunludur." });
    }

    if (!first_name || !last_name || !phone_number || !email) {
        return res.status(400).json({
            success: false,
            message: "Ad, Soyad, Telefon ve E-posta alanları boş bırakılamaz.",
        });
    }

    let formattedBirthDate = birth_date ? new Date(birth_date).toISOString().split("T")[0] : null;

    const sql = `UPDATE customers SET first_name = ?, last_name = ?, birth_date = ?, branch_code = ?, email = ?, address = ?, gender = ?, phone_number = ? WHERE tckn = ? AND role = 'PERSONNEL'`;

    const values = [
        first_name, last_name, formattedBirthDate, branch_code,
        email, address, gender, phone_number, tckn
    ];

    try {
        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Bu TCKN ile kayıtlı bir personel bulunamadı veya bilgilerde değişiklik yapılmadı.",
            });
        }

        const [updatedRows] = await pool.query(`SELECT * FROM customers WHERE tckn = ? AND role = 'PERSONNEL'`, [tckn]);
        const { password_hash, ...updatedPersonnelData } = updatedRows[0];

        res.status(200).json({
            success: true,
            message: "Personel bilgileri başarıyla güncellendi.",
            data: updatedPersonnelData,
        });

    } catch (error) {
        console.error("Personel güncelleme sırasında hata:", error);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Bu E-posta veya Telefon Numarası başka bir kullanıcı tarafından kullanılıyor.",
            });
        }
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
    }
};

export const requestToggleStatusOTP = async (req, res) => {
    const { tckn } = req.params;
    if (!tckn) {
        return res.status(400).json({ success: false, message: "TCKN zorunludur." });
    }

    try {
        const [rows] = await pool.query("SELECT customer_id FROM customers WHERE tckn = ? AND role = 'PERSONNEL'", [tckn]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Personel bulunamadı." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const redisKey = `otp_toggle_status:${tckn}`;

        await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION_SECONDS });

        console.log(`--- PERSONEL DURUM DEĞİŞİKLİĞİ OTP SİMÜLASYONU ---`);
        console.log(`-> TCKN: ${tckn}`);
        console.log(`-> ONAY KODU (OTP): ${otp}`);
        console.log(`-------------------------------------------------`);

        res.status(200).json({
            success: true,
            message: "Personel durumu değişikliği için onay kodu (OTP) oluşturuldu ve 3 dakika geçerlidir."
        });

    } catch (error) {
        console.error("Durum değişikliği için OTP isteme hatası:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
    }
};

export const confirmToggleStatus = async (req, res) => {
    const { tckn } = req.params;
    const { otp } = req.body;

    if (!tckn || !otp) {
        return res.status(400).json({ success: false, message: "TCKN ve OTP zorunludur." });
    }

    const redisKey = `otp_toggle_status:${tckn}`;

    try {
        const otpFromRedis = await redisClient.get(redisKey);

        if (!otpFromRedis) {
            return res.status(400).json({ success: false, message: "Onay kodunun süresi dolmuş. Lütfen işlemi yeniden başlatın." });
        }

        if (otpFromRedis !== otp) {
            return res.status(400).json({ success: false, message: "Girdiğiniz onay kodu hatalı." });
        }

        const [personnelRows] = await pool.query("SELECT is_active FROM customers WHERE tckn = ? AND role = 'PERSONNEL'", [tckn]);
        if (personnelRows.length === 0) {
             return res.status(404).json({ success: false, message: "Personel bulunamadı." });
        }

        const currentStatus = personnelRows[0].is_active;
        const newStatus = currentStatus === 1 ? 0 : 1;

        await pool.query("UPDATE customers SET is_active = ? WHERE tckn = ?", [newStatus, tckn]);

        await redisClient.del(redisKey);

        const message = newStatus === 1 ? "Personel başarıyla aktifleştirildi." : "Personel başarıyla pasifleştirildi.";
        
        res.status(200).json({
            success: true,
            message: message,
            data: { tckn: tckn, is_active: newStatus }
        });

    } catch (error) {
        console.error("Personel durumu onaylama hatası:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
    }
};

export const getActivityLogs = async (req, res) => {
    try {
        const sql = `
            SELECT 
                pal.log_id,
                pal.personnel_id,
                CONCAT(c.first_name, ' ', c.last_name) AS personnel_name,
                c.username AS personnel_username,
                pal.action_type,
                pal.entity_type,
                pal.entity_identifier,
                pal.status,
                pal.details,
                pal.created_at
            FROM personnel_activity_logs pal
            JOIN customers c ON pal.personnel_id = c.customer_id
            ORDER BY pal.created_at DESC
            LIMIT 100;
        `;

        const [logs] = await pool.query(sql);

        res.status(200).json({
            success: true,
            logs: logs
        });

    } catch (error) {
        console.error("Aktivite logları alınırken hata oluştu:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu."
        });
    }
};