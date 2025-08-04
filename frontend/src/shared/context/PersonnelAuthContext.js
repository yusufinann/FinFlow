import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../../api/authService';

const PersonnelAuthContext = createContext(null);

export const PersonnelAuthProvider = ({ children }) => {
  const [personnel, setPersonnel] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem('personnelFinToken'));
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(() => {
    if (token) {
      try {
        const decodedPersonnel = jwtDecode(token);
        if (decodedPersonnel.exp * 1000 > Date.now()) {
          setPersonnel(decodedPersonnel);
        } else {
          sessionStorage.removeItem('personnelFinToken');
          setToken(null);
          setPersonnel(null);
        }
      } catch (error) {
        console.error("Geçersiz token, oturum temizleniyor:", error);
        sessionStorage.removeItem('personnelFinToken');
        setToken(null);
        setPersonnel(null);
      }
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      if (data.success && data.token) {
        sessionStorage.setItem('personnelFinToken', data.token);
        const decodedPersonnel = jwtDecode(data.token);
        setToken(data.token);
        setPersonnel(decodedPersonnel);
        return decodedPersonnel;
      }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Giriş işlemi sırasında bir hata oluştu.';
        throw new Error(errorMessage);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('personnelFinToken');
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

export const usePersonnelAuth = () => {
  const context = useContext(PersonnelAuthContext);
  if (!context) {
    throw new Error('usePersonnelAuth must be used within a PersonnelAuthProvider');
  }
  return context;
};