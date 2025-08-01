import pool from "../../config/db.js";

export const getMyNotifications = async (req, res) => {
    const customerId = req.user.id;

    try {
        const sql = "SELECT * FROM notifications WHERE customer_id = ? ORDER BY created_at DESC LIMIT 50";
        const [notifications] = await pool.query(sql, [customerId]);
        
        const unreadCountSql = "SELECT COUNT(*) as count FROM notifications WHERE customer_id = ? AND is_read = FALSE";
        const [unreadRows] = await pool.query(unreadCountSql, [customerId]);
        
        res.status(200).json({
            success: true,
            notifications,
            unreadCount: unreadRows[0].count
        });
    } catch (error) {
        console.error("Bildirimler getirilirken hata:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
};

export const markAllAsRead = async (req, res) => {
    const customerId = req.user.id;

    try {
        const sql = "UPDATE notifications SET is_read = TRUE WHERE customer_id = ? AND is_read = FALSE";
        const [result] = await pool.query(sql, [customerId]);

        res.status(200).json({ 
            success: true, 
            message: `${result.affectedRows} bildirim okundu olarak işaretlendi.`
        });
    } catch (error) {
        console.error("Bildirimler okunurken hata:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
};