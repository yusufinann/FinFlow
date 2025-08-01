import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Yetkilendirme başarısız. Token bulunamadı.' 
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Geçersiz veya süresi dolmuş token. Lütfen tekrar giriş yapın.' 
    });
  }
};

export default authenticateUser;