import pool from '../config/db.js';

/**
 * Personel aktivitelerini veritabanına loglar.
 * @param {object} logData - Log verilerini içeren obje.
 * @param {number} logData.personnel_id - İşlemi yapan personelin ID'si.
 * @param {string} logData.action_type - Yapılan işlemin türü (örn: 'CREATE_CUSTOMER').
 * @param {'SUCCESS' | 'FAILURE'} logData.status - İşlemin başarı durumu.
 * @param {string} [logData.entity_type] - Etkilenen varlığın türü (örn: 'CUSTOMER').
 * @param {string} [logData.entity_identifier] - Etkilenen varlığın kimliği (örn: TCKN).
 * @param {string} [logData.details] - Ek detaylar veya hata mesajı.
 */
export const logPersonnelActivity = async (logData) => {
    const {
        personnel_id,
        action_type,
        status,
        entity_type = null,
        entity_identifier = null,
        details = null
    } = logData;

    // Eğer personel ID'si yoksa loglama yapma. (Sistemsel işlemler için)
    if (!personnel_id) return;

    try {
        const sql = `
            INSERT INTO personnel_activity_logs 
            (personnel_id, action_type, entity_type, entity_identifier, status, details) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [personnel_id, action_type, entity_type, entity_identifier, status, details];
        await pool.query(sql, values);
    } catch (error) {
        // Loglama işlemi başarısız olursa, ana işlemi kesintiye uğratmamak için
        // hatayı sadece konsola yazdırıyoruz.
        console.error("FATAL: Personel aktivitesi loglanamadı:", error);
    }
};