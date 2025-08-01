import pool from "../../config/db.js";

export const getMyAccounts = async (req, res) => {
  const customerId = req.user.id;

  if (!customerId) {
    return res.status(401).json({
      success: false,
      message: "Yetkisiz erişim. Lütfen giriş yapın.",
    });
  }

  try {
    const sql = `
        SELECT 
            account_id,
            account_number,
            iban,
            balance,
            created_at,
            currency_code,
            account_type_code
        FROM 
            accounts
        WHERE 
            customer_id = ?
        ORDER BY
            created_at DESC
    `;

    const [accounts] = await pool.query(sql, [customerId]);

    if (accounts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Henüz bir hesabınız bulunmamaktadır.",
        accounts: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Hesaplarınız başarıyla listelendi.",
      count: accounts.length,
      accounts: accounts,
    });

  } catch (error) {
    console.error("Müşteri hesapları listelenirken hata:", error);
    res.status(500).json({
      success: false,
      message: "Hesaplar listelenirken bir sunucu hatası oluştu.",
    });
  }
};

export const getMyAccountDetails = async (req, res) => {
    const customerId = req.user.id;
    const { accountId } = req.params;

    if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Yetkisiz erişim. Lütfen giriş yapın.",
        });
    }

    try {
        const sql = `
            SELECT *
            FROM accounts
            WHERE 
                account_id = ? AND customer_id = ?
        `;

        const [rows] = await pool.query(sql, [accountId, customerId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hesap bulunamadı veya bu hesabı görme yetkiniz yok.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hesap detayı başarıyla getirildi.',
            account: rows[0]
        });

    } catch (error) {
        console.error("Müşteri hesap detayı alınırken hata:", error);
        res.status(500).json({
          success: false,
          message: "Hesap detayı alınırken bir sunucu hatası oluştu.",
        });
    }
};