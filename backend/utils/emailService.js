import sgMail from '@sendgrid/mail';

// API anahtarını uygulamanın başlangıcında bir kere ayarlıyoruz.
// Bu satır, .env dosyanızdaki anahtarı okur.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendPasswordResetCode = async (to, code) => {
 console.log('Kullanılan API Anahtarı:', process.env.SENDGRID_API_KEY);

   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to, // Alıcı e-posta adresi (authController'dan gelecek)
    from: {
      // .env dosyasında tanımladığınız ve SendGrid'de doğruladığınız adres
      email: process.env.SENDGRID_FROM_EMAIL, 
      // E-postanın "Kimden" kısmında görünecek isim
      name: 'FINFLOW', 
    },
    subject: "FinFlow Şifre Sıfırlama Kodu",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #dc143c;">FinFlow Şifre Sıfırlama Talebi</h2>
        <p>Merhaba,</p>
        <p>Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Aşağıdaki doğrulama kodunu kullanarak şifrenizi yenileyebilirsiniz. Bu kod <strong>3 dakika</strong> boyunca geçerlidir.</p>
        <div style="text-align:center; margin: 25px 0;">
          <span style="display:inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; border: 2px solid #dc143c; padding: 12px 24px; background-color: #f9f9f9; border-radius: 8px;">${code}</span>
        </div>
        <p>Eğer bu şifre sıfırlama talebini siz yapmadıysanız, bu e-postayı güvenle silebilirsiniz. Hesabınız güvendedir.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">Bu e-posta otomatik olarak gönderilmiştir, lütfen yanıtlamayınız.</p>
      </div>
    `,
  };

  try {
    // E-postayı SendGrid üzerinden gönderiyoruz.
    await sgMail.send(msg);
    console.log(`Şifre sıfırlama kodu ${to} adresine başarıyla gönderildi.`);
  } catch (error) {
    console.error("SendGrid ile e-posta gönderilirken hata oluştu:", error);

    // SendGrid'in döndürdüğü daha detaylı hataları log'lamak için
    if (error.response) {
      console.error(error.response.body);
    }
    
    throw new Error("E-posta gönderimi başarısız oldu.");
  }
};