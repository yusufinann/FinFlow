import jwt from 'jsonwebtoken';

/**
 * @desc    Sadece MÜŞTERİ rolüne sahip kullanıcıların erişimine izin verir.
 *          Token'ı doğrular ve payload'daki rolü kontrol eder.
 */
export const protectCustomer = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Yetkilendirme başarısız. Erişim token\'ı bulunamadı.' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ROL KONTROLÜ
    if (decoded.role !== 'customer') {
      return res.status(403).json({
          success: false,
          message: 'Erişim reddedildi. Bu işlem için müşteri yetkisi gereklidir.'
      });
    }

    // Doğrulanmış kullanıcı bilgilerini request objesine ekle
    req.user = decoded; // { id: ..., role: 'customer' }

    // Sonraki işleme devam et
    next();

  } catch (error) {
    // Bu blok jwt.verify'dan gelen hataları yakalar (örn: süresi dolmuş token)
    return res.status(401).json({ 
      success: false, 
      message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.' 
    });
  }
};


/**
 * @desc    Sadece PERSONEL rolüne sahip kullanıcıların erişimine izin verir.
 *          (Mevcut authenticateUser fonksiyonunuzun geliştirilmiş hali)
 */
export const protectPersonnel = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Yetkilendirme başarısız. Erişim token\'ı bulunamadı.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ROL KONTROLÜ
        if (decoded.role !== 'personnel') {
            return res.status(403).json({ success: false, message: 'Erişim reddedildi. Bu işlem için personel yetkisi gereklidir.' });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.' });
    }
};