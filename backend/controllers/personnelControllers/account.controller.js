import pool from "../../config/db.js";
import { logPersonnelActivity } from "../../utils/activityLogger.js";

const generateAccountIdentifiers = async (branchCode) => {
    let accountNumber, iban, isUnique = false;
    while(!isUnique) {
        const randomPart = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        accountNumber = `${branchCode}${randomPart}`.substring(0, 16);
        const countryCode = 'TR';
        const checkDigits = '55'; 
        const bankCode = '00062'; 
        iban = `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
        const [rows] = await pool.query("SELECT account_id FROM accounts WHERE iban = ?", [iban]);
        if (rows.length === 0) {
            isUnique = true;
        }
    }
    return { accountNumber, iban };
};

export const createAccount = async (req, res) => {
  const {
    tckn,
    account_type_code,
    currency_code,
    balance = 0,
    interest_rate = 0,
  } = req.body;
  
  const created_by_personnel_id = req.user.id;
  const branch_code = req.user.branch_code;

  if (!tckn || !account_type_code || !currency_code) {
    return res.status(400).json({
      success: false,
      message: "TCKN, Hesap Türü ve Para Birimi alanları zorunludur.",
    });
  }

  if (!created_by_personnel_id || !branch_code) {
      return res.status(401).json({
          success: false,
          message: "Yetkisiz işlem. Personel veya şube bilgisi bulunamadı."
      });
  }

  const connection = await pool.getConnection();
  let ibanForLog = null; // Hata durumunda bile loglayabilmek için

  try {
    await connection.beginTransaction();

    const findCustomerSql = "SELECT customer_id FROM customers WHERE tckn = ? AND role = 'CUSTOMER' FOR UPDATE";
    const [customerRows] = await connection.query(findCustomerSql, [tckn]);
    if (customerRows.length === 0) {
      throw new Error('Bu TCKN ile kayıtlı bir müşteri bulunamadı.');
    }
    const customer_id = customerRows[0].customer_id;

    const { accountNumber, iban } = await generateAccountIdentifiers(branch_code);
    ibanForLog = iban;

    const createAccountSql = `
      INSERT INTO accounts (
        customer_id, branch_code, account_number, iban, account_type_code,
        currency_code, balance, interest_rate, created_by_personnel_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      customer_id, branch_code, accountNumber, iban, account_type_code,
      currency_code, balance, interest_rate, created_by_personnel_id
    ];

    const [result] = await connection.query(createAccountSql, values);
    const newAccountId = result.insertId;

    await connection.commit();

    await logPersonnelActivity({
        personnel_id: created_by_personnel_id,
        action_type: 'CREATE_ACCOUNT',
        status: 'SUCCESS',
        entity_type: 'ACCOUNT',
        entity_identifier: iban,
        details: `Müşteri TCKN ${tckn} için ${currency_code} para biriminde yeni hesap oluşturuldu.`
    });

    const [newAccountRows] = await pool.query("SELECT * FROM accounts WHERE account_id = ?", [newAccountId]);

    res.status(201).json({
      success: true,
      message: "Hesap başarıyla oluşturuldu.",
      account: newAccountRows[0]
    });

  } catch (error) {
    if(connection) await connection.rollback();
    
    console.error("Hesap oluşturma sırasında hata:", error.message);

    await logPersonnelActivity({
        personnel_id: created_by_personnel_id,
        action_type: 'CREATE_ACCOUNT',
        status: 'FAILURE',
        entity_type: 'ACCOUNT',
        entity_identifier: ibanForLog || `TCKN: ${tckn}`,
        details: `Hata: ${error.message}`
    });

    if (error.message.includes('müşteri bulunamadı')) {
        return res.status(404).json({ success: false, message: error.message });
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Sistem hatası: Benzersiz IBAN üretilemedi veya başka bir benzersiz kısıtlama ihlal edildi.' });
    }

    res.status(500).json({ success: false, message: "Hesap oluşturulurken bir sunucu hatası oluştu." });
  } finally {
    if(connection) connection.release();
  }
};