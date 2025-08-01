import pool from "../../config/db.js";
import { broadcastToCustomer } from "../../websocket/websocketServer.js";

export const getDashboardSummary = async (req, res) => {
    const customerId = req.user.id;

    const balanceSql = `
        SELECT 
            SUM(CASE WHEN currency_code = 'TRY' THEN balance ELSE 0 END) as total_try_balance
        FROM accounts 
        WHERE customer_id = ? AND is_active = 1
    `;

    const transactionsSql = `
        SELECT 
            t.transaction_id,
            t.amount,
            t.currency_code,
            t.created_at,
            t.description,
            t.transaction_category,
            sa.customer_id AS source_customer_id
        FROM transactions t
        JOIN accounts sa ON t.source_account_id = sa.account_id
        JOIN accounts da ON t.destination_account_id = da.account_id
        WHERE sa.customer_id = ? OR da.customer_id = ?
        ORDER BY t.created_at DESC
        LIMIT 6;
    `;

    try {
        const [balanceRows] = await pool.query(balanceSql, [customerId]);
        const [transactionRows] = await pool.query(transactionsSql, [customerId, customerId]);

        const processedTransactions = transactionRows.map(tx => {
            const isSent = tx.source_customer_id === customerId;
            return {
                id: tx.transaction_id,
                type: isSent ? 'expense' : 'income',
                name: tx.description || tx.transaction_category,
                amount: isSent ? -parseFloat(tx.amount) : parseFloat(tx.amount),
                date: tx.created_at,
            };
        });

        res.status(200).json({
            success: true,
            transactions: processedTransactions,
            totalBalance: parseFloat(balanceRows[0].total_try_balance || 0),
        });

    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).json({
            success: false,
            message: "Özet bilgileri alınırken bir sunucu hatası oluştu."
        });
    }
};

export const getRecentTransactions = async (req, res) => {
    const customerId = req.user.id;

    const sql = `
        SELECT 
            t.transaction_id,
            t.amount,
            t.currency_code,
            t.created_at,
            t.description,
            sa.customer_id AS source_customer_id,
            da.customer_id AS destination_customer_id,
            CONCAT(src_cust.first_name, ' ', src_cust.last_name) AS source_full_name,
            CONCAT(dest_cust.first_name, ' ', dest_cust.last_name) AS destination_full_name
        FROM transactions t
        LEFT JOIN accounts sa ON t.source_account_id = sa.account_id
        LEFT JOIN accounts da ON t.destination_account_id = da.account_id
        LEFT JOIN customers src_cust ON sa.customer_id = src_cust.customer_id
        LEFT JOIN customers dest_cust ON da.customer_id = dest_cust.customer_id
        WHERE sa.customer_id = ? OR da.customer_id = ?
        ORDER BY t.created_at DESC
        LIMIT 10;
    `;

    try {
        const [rows] = await pool.query(sql, [customerId, customerId]);

        const processedTransactions = rows.map(tx => {
            const isSent = tx.source_customer_id === customerId;
            let partyName = 'Banka İşlemi';

            if (isSent) {
                partyName = tx.destination_full_name || 'Bilinmeyen Alıcı';
            } else {
                partyName = tx.source_full_name || 'Banka Transferi';
            }

            return {
                id: tx.transaction_id,
                type: isSent ? 'sent' : 'received',
                partyName: partyName,
                description: tx.description || (isSent ? 'Giden Transfer' : 'Gelen Transfer'),
                date: tx.created_at,
                amount: parseFloat(tx.amount),
                currency: tx.currency_code,
            };
        });

        res.status(200).json({
            success: true,
            transactions: processedTransactions,
        });

    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        res.status(500).json({
            success: false,
            message: "İşlemler alınırken bir sunucu hatası oluştu."
        });
    }
};

export const createCustomerTransfer = async (req, res) => {
    const senderCustomerId = req.user.id;
    const { sourceAccountId, destinationIban, destinationFullName, amount, description } = req.body;

    if (!sourceAccountId || !destinationIban || !destinationFullName || !amount) {
        return res.status(400).json({ success: false, message: 'Kaynak hesap, alıcı IBAN, alıcı Ad Soyad ve tutar zorunludur.' });
    }

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Tutar geçerli bir pozitif sayı olmalıdır.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const accountsSql = `
            SELECT a.account_id, a.customer_id, a.balance, a.currency_code, a.iban, a.is_active, c.first_name, c.last_name
            FROM accounts a JOIN customers c ON a.customer_id = c.customer_id
            WHERE (a.account_id = ? AND a.customer_id = ?) OR (a.iban = ?)
            FOR UPDATE
        `;
        const [accounts] = await connection.query(accountsSql, [sourceAccountId, senderCustomerId, destinationIban]);

        const sourceAccount = accounts.find(a => a.account_id == sourceAccountId);
        const destinationAccount = accounts.find(a => a.iban === destinationIban);
        
        const sourceAccountFullName = sourceAccount ? `${sourceAccount.first_name} ${sourceAccount.last_name}` : null;
        const destinationAccountFullName = destinationAccount ? `${destinationAccount.first_name} ${destinationAccount.last_name}` : null;
        
        if (!sourceAccount) {
            await connection.rollback();
            return res.status(403).json({ success: false, message: 'Belirtilen kaynak hesap size ait değil veya bulunamadı.' });
        }
        if (!destinationAccount || destinationAccountFullName.toLowerCase() !== destinationFullName.toLowerCase()) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Alıcı IBAN ve Ad Soyad bilgileri uyuşmuyor veya hesap bulunamadı.' });
        }
        if (sourceAccount.account_id === destinationAccount.account_id) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Kendi hesabınıza para gönderemezsiniz.' });
        }
        if (!sourceAccount.is_active || !destinationAccount.is_active) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Hesaplardan biri aktif değil. İşlem yapılamaz.' });
        }
        if (sourceAccount.currency_code !== destinationAccount.currency_code) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Farklı para birimleri arasında transfer yapılamaz.' });
        }
        if (parseFloat(sourceAccount.balance) < transferAmount) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Yetersiz bakiye.' });
        }

        const newSourceBalance = parseFloat(sourceAccount.balance) - transferAmount;
        const newDestinationBalance = parseFloat(destinationAccount.balance) + transferAmount;

        await connection.query('UPDATE accounts SET balance = ? WHERE account_id = ?', [newSourceBalance, sourceAccount.account_id]);
        await connection.query('UPDATE accounts SET balance = ? WHERE account_id = ?', [newDestinationBalance, destinationAccount.account_id]);

        const transactionSql = `
            INSERT INTO transactions (source_account_id, destination_account_id, amount, currency_code, transaction_category, transaction_subtype, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [transactionResult] = await connection.query(transactionSql, [
            sourceAccount.account_id, destinationAccount.account_id, transferAmount, sourceAccount.currency_code,
            'TRANSFER', 'MÜŞTERİLER ARASI TRANSFER', description || null, 'COMPLETED'
        ]);
        const newTransactionId = transactionResult.insertId;

        const notificationSql = `
            INSERT INTO notifications (customer_id, type, message, is_read, data)
            VALUES (?, ?, ?, ?, ?)
        `;
        const notificationData = JSON.stringify({
            transactionId: newTransactionId,
            amount: transferAmount,
            currency: sourceAccount.currency_code,
        });

        const receiverMessage = `Hesabınıza ${sourceAccountFullName} tarafından ${transferAmount.toLocaleString('tr-TR', { style: 'currency', currency: sourceAccount.currency_code })} geldi.`;
        await connection.query(notificationSql, [
            destinationAccount.customer_id, 'TRANSFER_RECEIVED', receiverMessage, false, notificationData
        ]);

        const senderMessage = `${destinationAccountFullName} adlı kişiye ${transferAmount.toLocaleString('tr-TR', { style: 'currency', currency: sourceAccount.currency_code })} gönderdiniz.`;
        await connection.query(notificationSql, [
            senderCustomerId, 'TRANSFER_SENT', senderMessage, false, notificationData
        ]);
        
        await connection.commit();
        
        broadcastToCustomer(senderCustomerId, {
            type: 'TRANSFER_SENT',
            message: senderMessage,
            data: { 
                accountId: sourceAccount.account_id, 
                newBalance: newSourceBalance,
                amount: transferAmount,
                currency: sourceAccount.currency_code
            },
            newNotification: true
        });

        broadcastToCustomer(destinationAccount.customer_id, {
            type: 'TRANSFER_RECEIVED',
            message: receiverMessage,
            data: { 
                accountId: destinationAccount.account_id, 
                newBalance: newDestinationBalance,
                amount: transferAmount,
                currency: sourceAccount.currency_code
            },
            newNotification: true
        });

        res.status(201).json({
            success: true,
            message: 'Para transferi başarıyla gerçekleştirildi.',
            transactionId: newTransactionId
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Müşteri para transferi sırasında hata:", error);
        res.status(500).json({ success: false, message: 'Transfer sırasında bir sunucu hatası oluştu.' });
    } finally {
        if (connection) connection.release();
    }
};