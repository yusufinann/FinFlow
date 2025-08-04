import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
const OTP_EXPIRATION_SECONDS = 180; // OTP geçerlilik süresi: 3 dakika

/**
 * @desc   Personelin ilk şifresini oluşturmak için OTP talep etmesini sağlar.
 * @route  POST /api/customers/password/request-otp
 */
export const requestInitialPasswordOTP = async (req, res) => {
    const { username, tckn } = req.body;
    
    if (!username || !tckn) {
        return res.status(400).json({
            success: false,
            message: "Personel No(username) ve TCKN alanları zorunludur.",
        });
    }

    try {  
        const [rows] = await pool.query(
            "SELECT customer_id, tckn, phone_number, password_hash FROM customers WHERE username = ? AND tckn = ?",
            [username, tckn]
        );
        const personnel = rows[0]; // Değişken adı 'personel'

        if (!personnel) {
            return res.status(404).json({
                success: false,
                message: "Girdiğiniz bilgilerle eşleşen bir personel bulunamadı.",
            });
        }

        if (personnel.password_hash !== null) {
            return res.status(400).json({
                success: false,
                message: "Bu hesap için daha önce bir şifre belirlenmiş. Lütfen 'Şifremi Unuttum' adımını kullanın.",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const redisKey = `otp_initial_password:${username}`; 
        
        await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION_SECONDS });
        
        console.log(`--- İLK ŞİFRE OLUŞTURMA OTP SİMÜLASYONU ---`);
        console.log(`-> Personel No: ${username}`);
        console.log(`-> TCKN: ${personnel.tckn}`); 
        console.log(`-> Gönderilen OTP: ${otp}`);
        console.log(`-------------------------------------------`);

        res.status(200).json({
            success: true,
            message: `Kayıtlı telefon numaranıza 6 haneli bir doğrulama kodu gönderilmiştir.`,
        });
    } catch (error) {
        console.error("OTP talep etme sırasında hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
    }
};

export const setInitialPassword = async (req, res) => {
    const { username, otp, newPassword } = req.body;

    if (!username || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Personel No(username), OTP ve yeni şifre alanları zorunludur.",
        });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Şifre en az 6 karakter olmalıdır.",
        });
    }
    
    const redisKey = `otp_initial_password:${username}`;
    
    try {
        const otpFromRedis = await redisClient.get(redisKey);

        if (!otpFromRedis) {
            return res.status(400).json({
                success: false,
                message: "OTP süresi dolmuş veya geçersiz.",
            });
        }
        
        if (otpFromRedis !== otp) {
            return res.status(400).json({
                success: false,
                message: "Girdiğiniz doğrulama kodu hatalı.",
            });
        }

        // DÜZELTME 3: Değişken adı 'newPassword' olarak kullanıldı.
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        const [result] = await pool.query(
            "UPDATE customers SET password_hash = ? WHERE username = ?",
            [hashedPassword, username]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Şifresi güncellenecek personel bulunamadı.",
            });
        }

        await redisClient.del(redisKey);

        res.status(200).json({
            success: true,
            message: "Şifreniz başarıyla oluşturuldu. Artık giriş yapabilirsiniz.",
        });
    } catch (error) {
        console.error("İlk şifre belirleme sırasında hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
    }
};