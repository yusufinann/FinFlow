// CustomerAuthProvider.js - DÜZELTİLMİŞ VE STABİL KOD

import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../../api/customerPanelServices/authService';

const CustomerAuthContext = createContext(null);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = useCallback(() => {
    setIsLoading(true);
    try {
      const storedToken = sessionStorage.getItem('customerFinToken');
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setCustomer(decoded);
        } else {
          sessionStorage.removeItem('customerFinToken');
        }
      }
    } catch (error) {
      console.error("Token işlenirken hata oluştu, oturum temizleniyor:", error);
      sessionStorage.removeItem('customerFinToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (customer_number, password) => {
    const response = await authService.login(customer_number, password);
    if (response.success && response.token) {
      sessionStorage.setItem('customerFinToken', response.token);
      const decodedCustomer = jwtDecode(response.token);
      setToken(response.token);
      console.log('Giriş başarılı, müşteri bilgileri:', decodedCustomer);
      setCustomer(decodedCustomer);
      return response;
    }
    throw new Error(response.message || 'Giriş başarısız.');
  }, []); 

  const logout = useCallback(() => {
    authService.logout();
    sessionStorage.removeItem('customerFinToken');
    setToken(null);
    setCustomer(null);
  }, []); 
  const value = useMemo(() => ({
    isAuthenticated: !!customer,
    customer,
    token,
    login,
    logout,
    isLoading,
  }), [customer, token, isLoading, login, logout]);

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};