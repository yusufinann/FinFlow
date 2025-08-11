// personnel/customer.controller.js : 

import pool from "../../config/db.js";
import { logPersonnelActivity } from "../../utils/activityLogger.js";
import redisClient from "../../config/redisClient.js"; // EKLENDİ

const OTP_EXPIRATION_SECONDS = 180; // EKLENDİ

const generateUniqueCustomerNumber = async () => {
  let customerNumber;
  let isUnique = false;
  while (!isUnique) {
    customerNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const [rows] = await pool.query(
      "SELECT customer_id FROM customers WHERE customer_number = ?",
      [customerNumber]
    );
    if (rows.length === 0) {
      isUnique = true;
    }
  }
  return customerNumber;
};

export const createCustomer = async (req, res) => {
  const {
    tckn,
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
    branch_code,
  } = req.body;

  const performing_personnel_id = req.user?.id;

  if (!tckn || !first_name || !last_name || !phone_number) {
    return res.status(400).json({
      success: false,
      message: "TCKN, Ad, Soyad ve Telefon Numarası alanları zorunludur.",
    });
  }

  try {
    const customer_number = await generateUniqueCustomerNumber();

    const sql = `
      INSERT INTO customers (
        customer_number, tckn, first_name, last_name, birth_date, gender, 
        phone_number, email, address, branch_code, created_by_personnel_id,
        role 
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CUSTOMER')
    `;

    const values = [
      customer_number, tckn, first_name, last_name, birth_date || null,
      gender || null, phone_number, email || null, address || null, 
      branch_code || null, performing_personnel_id,
    ];

    const [result] = await pool.query(sql, values);

    await logPersonnelActivity({
        personnel_id: performing_personnel_id,
        action_type: 'CREATE_CUSTOMER',
        status: 'SUCCESS',
        entity_type: 'CUSTOMER',
        entity_identifier: tckn,
        details: `Yeni müşteri kaydı oluşturuldu. Müşteri Numarası: ${customer_number}`
    });

    res.status(201).json({
      success: true,
      message: "Müşteri başarıyla oluşturuldu.",
      data: {
        customerId: result.insertId,
        customerNumber: customer_number,
      },
    });
  } catch (error) {
    console.error("Müşteri oluşturma sırasında hata:", error);
    
    await logPersonnelActivity({
        personnel_id: performing_personnel_id,
        action_type: 'CREATE_CUSTOMER',
        status: 'FAILURE',
        entity_type: 'CUSTOMER',
        entity_identifier: tckn,
        details: `Hata: ${error.message}`
    });

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

export const getCustomerDetails = async (req, res) => {
  const { tckn } = req.params; 
  const performing_personnel_id = req.user?.id;

  if (!tckn) {
    return res.status(400).json({
      success: false,
      message: "TCKN veya Müşteri Numarası zorunludur.",
    });
  }

  const customerSql = "SELECT * FROM customers WHERE (tckn = ? OR customer_number = ?) AND role = 'CUSTOMER' AND customer_number != '000000'";

  try {
    const [customerRows] = await pool.query(customerSql, [tckn, tckn]);

    if (customerRows.length === 0) {
      await logPersonnelActivity({
          personnel_id: performing_personnel_id,
          action_type: 'GET_CUSTOMER_DETAILS',
          status: 'FAILURE',
          entity_type: 'CUSTOMER',
          entity_identifier: tckn,
          details: 'Müşteri bulunamadı.'
      });
      return res.status(404).json({
        success: false,
        message: "Belirtilen kimlik bilgileri ile müşteri bulunamadı.",
      });
    }

    const customer = customerRows[0];
    const accountsSql = "SELECT * FROM accounts WHERE customer_id = ? AND is_active = 1";
    const [accountsRows] = await pool.query(accountsSql, [customer.customer_id]);

    const { password_hash, ...customerData } = customer;

    await logPersonnelActivity({
        personnel_id: performing_personnel_id,
        action_type: 'GET_CUSTOMER_DETAILS',
        status: 'SUCCESS',
        entity_type: 'CUSTOMER',
        entity_identifier: tckn,
        details: 'Müşteri detayları ve hesapları görüntülendi.'
    });

    res.status(200).json({
      success: true,
      customer: customerData,
      accounts: accountsRows,
    });
  } catch (error) {
    console.error("Müşteri detayları sorgulama sırasında hata:", error);
    await logPersonnelActivity({
        personnel_id: performing_personnel_id,
        action_type: 'GET_CUSTOMER_DETAILS',
        status: 'FAILURE',
        entity_type: 'CUSTOMER',
        entity_identifier: tckn,
        details: `Hata: ${error.message}`
    });
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

export const updateCustomer = async (req, res) => {
  const { tckn } = req.params;
  const {
    first_name,
    last_name,
    birth_date,
    gender,
    phone_number,
    email,
    address,
    branch_code,
    is_active,
  } = req.body;
  
  const performing_personnel_id = req.user?.id;

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

  const sql = `
    UPDATE customers 
    SET first_name = ?, last_name = ?, birth_date = ?, gender = ?,
        phone_number = ?, email = ?, address = ?, branch_code = ?, is_active = ?
    WHERE tckn = ? AND role = 'CUSTOMER' AND customer_number != '000000'`;

  const values = [
    first_name, last_name, formattedBirthDate, gender, phone_number,
    email, address, branch_code, is_active, tckn,
  ];

  try {
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
       await logPersonnelActivity({
          personnel_id: performing_personnel_id,
          action_type: 'UPDATE_CUSTOMER',
          status: 'FAILURE',
          entity_type: 'CUSTOMER',
          entity_identifier: tckn,
          details: 'Güncellenecek müşteri bulunamadı.'
      });
      return res.status(404).json({
        success: false,
        message: "Güncellenecek müşteri bulunamadı veya bu bir personel kaydıdır.",
      });
    }

    const [updatedRows] = await pool.query(`SELECT * FROM customers WHERE tckn = ?`,[tckn]);
    const { password_hash, ...updatedCustomerData } = updatedRows[0];
    
    await logPersonnelActivity({
        personnel_id: performing_personnel_id,
        action_type: 'UPDATE_CUSTOMER',
        status: 'SUCCESS',
        entity_type: 'CUSTOMER',
        entity_identifier: tckn,
        details: 'Müşteri bilgileri başarıyla güncellendi.'
    });

    res.status(200).json({
      success: true,
      message: "Müşteri bilgileri başarıyla güncellendi.",
      customer: updatedCustomerData,
    });
  } catch (error) {
    console.error("Müşteri güncelleme sırasında hata:", error);

    await logPersonnelActivity({
        personnel_id: performing_personnel_id,
        action_type: 'UPDATE_CUSTOMER',
        status: 'FAILURE',
        entity_type: 'CUSTOMER',
        entity_identifier: tckn,
        details: `Hata: ${error.message}`
    });

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Bu e-posta veya telefon numarası başka bir müşteri tarafından kullanılıyor.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

export const getAllCustomers = async (req, res) => {
  const sql = "SELECT customer_id, customer_number, tckn, first_name, last_name, email, phone_number, is_active FROM customers WHERE role = 'CUSTOMER' AND customer_number != '000000' ORDER BY created_at DESC";
  
  try {
    const [rows] = await pool.query(sql);

    res.status(200).json({
      success: true,
      customers: rows,
    });
  } catch (error) {
    console.error("Tüm müşteriler sorgulanırken hata:", error);

    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

// --- YENİ EKLENEN FONKSİYONLAR ---

export const requestToggleCustomerStatusOTP = async (req, res) => {
    const { tckn } = req.params;
    const performing_personnel_id = req.user?.id;

    if (!tckn) {
        return res.status(400).json({ success: false, message: "TCKN veya Müşteri Numarası zorunludur." });
    }

    try {
        const [rows] = await pool.query("SELECT customer_id FROM customers WHERE (tckn = ? OR customer_number = ?) AND role = 'CUSTOMER' AND customer_number != '000000'", [tckn, tckn]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Müşteri bulunamadı." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const redisKey = `otp_toggle_customer_status:${tckn}`;

        await redisClient.set(redisKey, otp, { EX: OTP_EXPIRATION_SECONDS });

        await logPersonnelActivity({
            personnel_id: performing_personnel_id,
            action_type: 'REQUEST_TOGGLE_CUSTOMER_STATUS',
            status: 'SUCCESS',
            entity_type: 'CUSTOMER',
            entity_identifier: tckn,
            details: 'Müşteri durumu değişikliği için OTP oluşturuldu.'
        });
        
        console.log(`--- MÜŞTERİ DURUM DEĞİŞİKLİĞİ OTP SİMÜLASYONU (Personel ID: ${performing_personnel_id}) ---`);
        console.log(`-> Müşteri TCKN/No: ${tckn}`);
        console.log(`-> ONAY KODU (OTP): ${otp}`);
        console.log(`---------------------------------------------------------------------------------`);

        res.status(200).json({
            success: true,
            message: "Müşteri durumu değişikliği için onay kodu (OTP) oluşturuldu ve 3 dakika geçerlidir."
        });

    } catch (error) {
        console.error("Müşteri durum değişikliği için OTP isteme hatası:", error);
         await logPersonnelActivity({
            personnel_id: performing_personnel_id,
            action_type: 'REQUEST_TOGGLE_CUSTOMER_STATUS',
            status: 'FAILURE',
            entity_type: 'CUSTOMER',
            entity_identifier: tckn,
            details: `Hata: ${error.message}`
        });
        res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
    }
};

export const confirmToggleCustomerStatus = async (req, res) => {
    const { tckn } = req.params;
    const { otp } = req.body;
    const performing_personnel_id = req.user?.id;

    if (!tckn || !otp) {
        return res.status(400).json({ success: false, message: "TCKN/Müşteri Numarası ve OTP zorunludur." });
    }

    const redisKey = `otp_toggle_customer_status:${tckn}`;

    try {
        const otpFromRedis = await redisClient.get(redisKey);

        if (!otpFromRedis) {
            return res.status(400).json({ success: false, message: "Onay kodunun süresi dolmuş. Lütfen işlemi yeniden başlatın." });
        }

        if (otpFromRedis !== otp) {
             await logPersonnelActivity({
                personnel_id: performing_personnel_id,
                action_type: 'CONFIRM_TOGGLE_CUSTOMER_STATUS',
                status: 'FAILURE',
                entity_type: 'CUSTOMER',
                entity_identifier: tckn,
                details: 'Geçersiz OTP girildi.'
            });
            return res.status(400).json({ success: false, message: "Girdiğiniz onay kodu hatalı." });
        }

        const [customerRows] = await pool.query("SELECT is_active FROM customers WHERE (tckn = ? OR customer_number = ?) AND role = 'CUSTOMER' AND customer_number != '000000'", [tckn, tckn]);
        if (customerRows.length === 0) {
             return res.status(404).json({ success: false, message: "Müşteri bulunamadı." });
        }

        const currentStatus = customerRows[0].is_active;
        const newStatus = currentStatus === 1 ? 0 : 1;

        await pool.query("UPDATE customers SET is_active = ? WHERE (tckn = ? OR customer_number = ?) AND role = 'CUSTOMER'", [newStatus, tckn, tckn]);

        await redisClient.del(redisKey);

        const message = newStatus === 1 ? "Müşteri başarıyla aktifleştirildi." : "Müşteri başarıyla pasifleştirildi.";
        
        await logPersonnelActivity({
            personnel_id: performing_personnel_id,
            action_type: 'CONFIRM_TOGGLE_CUSTOMER_STATUS',
            status: 'SUCCESS',
            entity_type: 'CUSTOMER',
            entity_identifier: tckn,
            details: message
        });

        res.status(200).json({
            success: true,
            message: message,
            data: { tckn: tckn, is_active: newStatus }
        });

    } catch (error) {
        console.error("Müşteri durumu onaylama hatası:", error);
        await logPersonnelActivity({
            personnel_id: performing_personnel_id,
            action_type: 'CONFIRM_TOGGLE_CUSTOMER_STATUS',
            status: 'FAILURE',
            entity_type: 'CUSTOMER',
            entity_identifier: tckn,
            details: `Hata: ${error.message}`
        });
        res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
    }
};