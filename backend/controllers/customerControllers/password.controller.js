import pool from "../../config/db.js";
import redisClient from "../../config/redisClient.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const OTP_EXPIRATION_SECONDS = 180; // OTP geçerlilik süresi: 3 dakika

/**
 * @desc   Müşterinin ilk şifresini oluşturmak için OTP talep etmesini sağlar.
 * @route  POST /api/customers/password/request-otp
 */
export const requestInitialPasswordOTP = async (req, res) => {
  const { customer_number, tckn } = req.body;

  if (!customer_number || !tckn) {
    return res.status(400).json({
      success: false,
      message: "Müşteri Numarası ve TCKN alanları zorunludur.",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT customer_id, phone_number, password_hash FROM customers WHERE customer_number = ? AND tckn = ?",
      [customer_number, tckn]
    );

    const customer = rows[0];

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Girdiğiniz bilgilerle eşleşen bir müşteri bulunamadı.",
      });
    }

    if (customer.password_hash !== null) {
      return res.status(400).json({
        success: false,
        message: "Bu hesap için daha önce bir şifre belirlenmiş. Lütfen 'Şifremi Unuttum' adımını kullanın.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `otp_initial_password:${customer_number}`;

    await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION_SECONDS });

    // Gerçek bir uygulamada bu OTP, SMS servis sağlayıcısı aracılığıyla gönderilir.
    console.log(`--- İLK ŞİFRE OLUŞTURMA OTP SİMÜLASYONU ---`);
    console.log(`-> Müşteri No: ${customer_number}`);
    console.log(`-> Telefon No: ${customer.phone_number}`);
    console.log(`-> Gönderilen OTP: ${otp}`);
    console.log(`-------------------------------------------`);

    res.status(200).json({
      success: true,
      message: `Kayıtlı telefon numaranıza 6 haneli bir doğrulama kodu gönderilmiştir.`,
    });
  } catch (error) {
    console.error("İlk şifre için OTP isteme sırasında hata:", error);
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};


/**
 * @desc   Müşterinin OTP'yi ve yeni şifresini kullanarak ilk şifresini ayarlamasını sağlar.
 * @route  POST /api/customers/password/set-initial
 */
export const setInitialPassword = async (req, res) => {
  const { customer_number, otp, newPassword } = req.body;

  if (!customer_number || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Müşteri Numarası, OTP ve Yeni Şifre alanları zorunludur.",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Şifreniz en az 6 karakter olmalıdır.",
    });
  }

  const redisKey = `otp_initial_password:${customer_number}`;

  try {
    const otpFromRedis = await redisClient.get(redisKey);

    if (!otpFromRedis) {
      return res.status(400).json({
        success: false,
        message: "Doğrulama kodunun süresi dolmuş. Lütfen yeniden kod talep edin.",
      });
    }

    if (otpFromRedis !== otp) {
      return res.status(400).json({
        success: false,
        message: "Girdiğiniz doğrulama kodu hatalı.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const [result] = await pool.query(
      "UPDATE customers SET password_hash = ? WHERE customer_number = ?",
      [hashedPassword, customer_number]
    );

    if (result.affectedRows === 0) {
      // Bu durumun normalde yaşanmaması gerekir ama bir güvenlik önlemidir.
      return res.status(404).json({
        success: false,
        message: "Şifresi güncellenecek müşteri bulunamadı.",
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