import pool from "../../config/db.js";

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
    created_by_personnel_id,
  } = req.body;

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
      branch_code || null, created_by_personnel_id,
    ];

    const [result] = await pool.query(sql, values);

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

  if (!tckn) {
    return res.status(400).json({
      success: false,
      message: "TCKN veya Müşteri Numarası zorunludur.",
    });
  }

  // Sorguyu hem TCKN hem de Müşteri Numarasına göre yapacak şekilde güncelledik
  const customerSql = "SELECT * FROM customers WHERE (tckn = ? OR customer_number = ?) AND role = 'CUSTOMER'";

  try {
    const [customerRows] = await pool.query(customerSql, [tckn, tckn]);

    if (customerRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Belirtilen kimlik bilgileri ile müşteri bulunamadı.",
      });
    }

    const customer = customerRows[0];
    const accountsSql = "SELECT * FROM accounts WHERE customer_id = ? AND is_active = 1";
    const [accountsRows] = await pool.query(accountsSql, [customer.customer_id]);

    const { password_hash, ...customerData } = customer;

    res.status(200).json({
      success: true,
      customer: customerData,
      accounts: accountsRows,
    });
  } catch (error) {
    console.error("Müşteri detayları sorgulama sırasında hata:", error);
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
    WHERE tckn = ? AND role = 'CUSTOMER'`;

  const values = [
    first_name,
    last_name,
    formattedBirthDate,
    gender,
    phone_number,
    email,
    address,
    branch_code,
    is_active,
    tckn,
  ];

  try {
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek müşteri bulunamadı veya bu bir personel kaydıdır.",
      });
    }

    const [updatedRows] = await pool.query(
      `SELECT * FROM customers WHERE tckn = ?`,
      [tckn]
    );

    const { password_hash, ...updatedCustomerData } = updatedRows[0];

    res.status(200).json({
      success: true,
      message: "Müşteri bilgileri başarıyla güncellendi.",
      customer: updatedCustomerData,
    });
  } catch (error) {
    console.error("Müşteri güncelleme sırasında hata:", error);
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
  // SQL sorgusuna `WHERE role = 'CUSTOMER'` koşulu eklendi.
  const sql =
    "SELECT customer_id, customer_number, tckn, first_name, last_name, email, phone_number, is_active FROM customers WHERE role = 'CUSTOMER' ORDER BY created_at DESC";

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