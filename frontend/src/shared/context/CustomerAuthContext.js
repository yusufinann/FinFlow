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

  const login = useCallback(async (customer_number, password, rememberMe = false) => {
    const response = await authService.login(customer_number, password);
    if (response.success && response.token) {
      sessionStorage.setItem('customerFinToken', response.token);
      const decodedCustomer = jwtDecode(response.token);
      setToken(response.token);
      setCustomer(decodedCustomer);

      // "Beni Hatırla" seçili ise kullanıcı bilgilerini localStorage'a kaydet
      if (rememberMe) {
        const customerInfo = {
          customerNumber: customer_number,
          customerName: decodedCustomer.fullName || 'Müşteri',
          rememberedAt: new Date().toISOString(),
        };
        localStorage.setItem('rememberedCustomerInfo', JSON.stringify(customerInfo));
        console.log('Kullanıcı bilgileri hatırlandı:', customerInfo);
      } else {
        // "Beni Hatırla" seçili değilse önceki kayıtları temizle
        localStorage.removeItem('rememberedCustomerInfo');
      }

      return response;
    }
    throw new Error(response.message || 'Giriş başarısız.');
  }, []); 

  const logout = useCallback(() => {
    authService.logout();
    sessionStorage.removeItem('customerFinToken');
    // Çıkış yaparken "Beni Hatırla" bilgilerini koru, sadece token'ı temizle
    setToken(null);
    setCustomer(null);
  }, []); 

  // Hatırlanan kullanıcı bilgilerini temizleme fonksiyonu
  const clearRememberedUser = useCallback(() => {
    localStorage.removeItem('rememberedCustomerInfo');
  }, []);

  // Hatırlanan kullanıcı bilgilerini getirme fonksiyonu
  const getRememberedUser = useCallback(() => {
    try {
      const savedUserInfo = localStorage.getItem('rememberedCustomerInfo');
      if (savedUserInfo) {
        return JSON.parse(savedUserInfo);
      }
    } catch (error) {
      console.error('Hatırlanan kullanıcı bilgileri okunamadı:', error);
      localStorage.removeItem('rememberedCustomerInfo');
    }
    return null;
  }, []);

  const value = useMemo(() => ({
    isAuthenticated: !!customer,
    customer,
    token,
    login,
    logout,
    isLoading,
    clearRememberedUser,
    getRememberedUser,
  }), [customer, token, isLoading, login, logout, clearRememberedUser, getRememberedUser]);

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};