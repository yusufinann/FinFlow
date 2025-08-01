import { useState } from 'react';
import authService from '../../../../api/authService';

export const useRegisterPage = (onSuccess) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [branchCode, setBranchCode] = useState(''); // YENİ STATE

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor. Lütfen kontrol ediniz.');
      return;
    }
    
    setLoading(true);

    const payload = {
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      branch_code: branchCode, // YENİ ALANI PAYLOAD'A EKLE
    };

    try {
      const data = await authService.register(payload);
      
      if (data.success) {
        setSuccessMessage(data.message || 'Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
        throw new Error(data.message || 'Kayıt işlemi başarısız oldu.');
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    branchCode, setBranchCode, // YENİ STATE'İ DIŞARIYA AÇ
    error,
    successMessage,
    loading,
    handleRegister,
  };
};