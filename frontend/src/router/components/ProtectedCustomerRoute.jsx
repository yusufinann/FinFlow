import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCustomerAuth } from '../../shared/context/CustomerAuthContext'; // Context hook'unun doğru yolunu belirtin
import LoadingFallback from './LoadingFallback'; // Kendi dosya yolunuza göre düzenleyin

const ProtectedCustomerRoute = () => {
  // 1. Auth context'ten gerekli bilgileri alıyoruz.
  const { isAuthenticated, isLoading } = useCustomerAuth();

  // 2. isLoading true ise, context hala sessionStorage'dan veri okumaya
  //    veya kimlik doğrulama durumunu belirlemeye çalışıyordur.
  //    Bu sırada bekleme ekranı göstererek erken yönlendirmeyi önlüyoruz.
  if (isLoading) {
    return <LoadingFallback />;
  }

  // 3. Yükleme bittikten sonra, kullanıcının kimliğinin doğrulanıp doğrulanmadığını
  //    kontrol ediyoruz. Eğer doğrulanmamışsa, müşteri giriş sayfasına yönlendiriyoruz.
  //    'replace' prop'u, tarayıcı geçmişinde bir döngü oluşmasını engeller.
  if (!isAuthenticated) {
    return <Navigate to="/customer-login" replace />;
  }

  // 4. Tüm kontrollerden geçtiyse (yükleme bitti ve kullanıcı giriş yapmışsa),
  //    erişilmek istenen alt route'ları (yani korunan sayfaları) render ediyoruz.
  return <Outlet />;
};

export default ProtectedCustomerRoute;