import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../../../shared/context/PersonnelAuthContext';

export const useLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = usePersonnelAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loggedInPersonnel = await login(username, password);

      if (loggedInPersonnel) {
        const userRole = loggedInPersonnel.role;

        if (userRole === 'ADMIN') {
          navigate('/admin');
        } else if (userRole === 'PERSONNEL') {
          navigate('/personnel');
        } else {
          setError('Geçersiz kullanıcı rolü.');
        }
      } else {
         setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError(err.message || 'Kullanıcı adı veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    handleLogin,
  };
};