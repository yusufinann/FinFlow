import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../../api/authService';

const PersonnelAuthContext = createContext(null);

export const usePersonnelAuth = () => useContext(PersonnelAuthContext);

export const PersonnelAuthProvider = ({ children }) => {
  const [personnel, setPersonnel] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('personnelFinToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedPersonnel = jwtDecode(token);
        setPersonnel(decodedPersonnel);
      } catch (error) {
        console.error("Geçersiz personel token:", error);
        localStorage.removeItem('personnelFinToken');
        setPersonnel(null);
        setToken(null);
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    console.log("Login response:", data);
    if (data.success && data.token) {
      localStorage.setItem('personnelFinToken', data.token);
      setToken(data.token);
      const decodedPersonnel = jwtDecode(data.token);
      setPersonnel(decodedPersonnel);
      return true;
    }
    throw new Error(data.message || 'Kullanıcı adı veya şifre hatalı.');
  };

  const logout = () => {
    localStorage.removeItem('personnelFinToken');
    setPersonnel(null);
    setToken(null);
  };

  const value = {
    personnel,
    token,
    isAuthenticated: !!personnel,
    isLoading,
    login,
    logout,
  };
  
  return (
    <PersonnelAuthContext.Provider value={value}>
      {!isLoading && children}
    </PersonnelAuthContext.Provider>
  );
};