import { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../../shared/context/PersonnelAuthContext';

export const useLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const navigate=useNavigate();
  const { login } = usePersonnelAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true); 
    setError(null); 

    try {
      const isSuccess=await login(username, password);
      if(isSuccess){
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
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