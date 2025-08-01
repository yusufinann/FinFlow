import pool from "../../config/db.js";
import { broadcastToCustomer } from "../../websocket/websocketServer.js";

const BANK_POOL_ACCOUNTS = {
  'TRY': 'TR110006200000000000000001',
  'USD': 'TR220006200000000000000003',
  'EUR': 'TR330006200000000000000004'
};

export const createPersonnelTransfer = async (req, res) => {
  const {
    destination_account_iban,
    amount,
    currency_code,
    transaction_category,
    transaction_subtype,
    description,
    created_by_personnel_id,
  } = req.body;

  if (!destination_account_iban || !amount || !currency_code || !transaction_category || !created_by_personnel_id) {
    return res.status(400).json({ success: false, message: "Hedef IBAN, Tutar, Para Birimi, Kategori ve Personel ID zorunludur." });
  }

  const source_account_iban = BANK_POOL_ACCOUNTS[currency_code];
  if (!source_account_iban) {
    return res.status(400).json({ success: false, message: `Banka, ${currency_code} para biriminde işlem yapmayı desteklemiyor.` });
  }
  
  const transferAmount = Number(amount);
  if (transferAmount <= 0) {
    return res.status(400).json({ success: false, message: "Tutar pozitif bir değer olmalıdır." });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const getAccountsSql = `
        SELECT account_id, customer_id, balance, currency_code, is_active, iban 
        FROM accounts 
        WHERE iban IN (?, ?)
        FOR UPDATE
    `;
    const [accounts] = await connection.query(getAccountsSql, [source_account_iban, destination_account_iban]);
  
    const sourceAccount = accounts.find(acc => acc.iban === source_account_iban);
    const destinationAccount = accounts.find(acc => acc.iban === destination_account_iban);

    if (!sourceAccount) {
      throw new Error("Sistemsel hata: Bankanın kaynak havuz hesabı bulunamadı.");
    }
    if (!destinationAccount) {
      throw new Error("Müşteriye ait hedef hesap bulunamadı.");
    }
    if (!destinationAccount.is_active) {
      throw new Error("Hedef hesap aktif değil. İşlem yapılamaz.");
    }
    if (sourceAccount.currency_code !== currency_code || destinationAccount.currency_code !== currency_code) {
      throw new Error("Hesapların ve işlemin para birimleri uyuşmuyor.");
    }
    
    const currentSourceBalance = Number(sourceAccount.balance);
    if (currentSourceBalance < transferAmount) {
      throw new Error("Bankanın kaynak hesabının bakiyesi yetersiz.");
    }

    const currentDestinationBalance = Number(destinationAccount.balance);

    const newSourceBalance = currentSourceBalance - transferAmount;
    const newDestinationBalance = currentDestinationBalance + transferAmount;

    await connection.query("UPDATE accounts SET balance = ? WHERE account_id = ?", [newSourceBalance, sourceAccount.account_id]);
    await connection.query("UPDATE accounts SET balance = ? WHERE account_id = ?", [newDestinationBalance, destinationAccount.account_id]);

    const transactionSql = `
        INSERT INTO transactions (source_account_id, destination_account_id, amount, currency_code, transaction_category, transaction_subtype, description, created_by_personnel_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [transactionResult] = await connection.query(transactionSql, [
      sourceAccount.account_id,
      destinationAccount.account_id,
      transferAmount,
      currency_code,
      transaction_category,
      transaction_subtype || null,
      description || null,
      created_by_personnel_id
    ]);
    
    const notificationMessage = `Hesabınıza ${transferAmount.toLocaleString('tr-TR', { style: 'currency', currency: currency_code })} tutarında transfer geldi.`;
    
    const notificationSql = `
        INSERT INTO notifications (customer_id, type, message, data)
        VALUES (?, ?, ?, ?)
    `;
    const notificationData = {
        transactionId: transactionResult.insertId,
        amount: transferAmount,
        currency: currency_code,
        description: description
    };

    await connection.query(notificationSql, [
        destinationAccount.customer_id,
        'INCOMING_TRANSFER',
        notificationMessage,
        JSON.stringify(notificationData)
    ]);
    
    await connection.commit();

    const notificationPayload = {
        type: 'INCOMING_TRANSFER',
        data: {
            accountId: destinationAccount.account_id,
            newBalance: newDestinationBalance,
            amount: transferAmount,
            currency: currency_code,
            description: description,
        },
        newNotification: true 
    };
    broadcastToCustomer(destinationAccount.customer_id, notificationPayload);

    res.status(200).json({ 
        success: true, 
        message: "Transfer başarıyla gerçekleştirildi.",
        transactionId: transactionResult.insertId
    });

  } catch (error) {
    await connection.rollback(); 
    console.error("Transfer işlemi sırasında hata:", error.message);
    res.status(500).json({ success: false, message: error.message || "Transfer sırasında bir sunucu hatası oluştu." });
  } finally {
    connection.release();
  }
};