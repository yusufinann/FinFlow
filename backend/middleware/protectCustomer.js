import jwt from 'jsonwebtoken';


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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'CUSTOMER') {
      return res.status(403).json({
          success: false,
          message: 'Erişim reddedildi. Bu işlem için müşteri yetkisi gereklidir.'
      });
    }

    req.user = decoded; 

    next();

  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.' 
    });
  }
};

export const protectPersonnel = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Yetkilendirme başarısız. Erişim token\'ı bulunamadı.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
        if (decoded.role !== 'personnel') {
            return res.status(403).json({ success: false, message: 'Erişim reddedildi. Bu işlem için personel yetkisi gereklidir.' });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.' });
    }
};