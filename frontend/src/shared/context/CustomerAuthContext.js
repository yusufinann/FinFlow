import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/customerPanelServices/authService';
import LoadingFallback from '../../router/components/LoadingFallback';

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
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('customerFinToken');
    const storedCustomer = localStorage.getItem('customer');

    if (storedToken && storedCustomer) {
      try {
        setToken(storedToken);
        setCustomer(JSON.parse(storedCustomer));
      } catch (error) {
        console.error("localStorage'dan veri okunamadı, çıkış yapılıyor.", error);
        localStorage.removeItem('customerFinToken');
        localStorage.removeItem('customer');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (customer_number, password) => {
    try {
      const response = await authService.login(customer_number, password);
      if (response.success && response.token && response.customer) {
        localStorage.setItem('customerFinToken', response.token);
        localStorage.setItem('customer', JSON.stringify(response.customer));
        setToken(response.token);
        setCustomer(response.customer);
        navigate('/customer/dashboard');
        return response;
      }
      throw new Error(response.message || 'Giriş başarısız.');
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('customerFinToken');
    localStorage.removeItem('customer');
    setToken(null);
    setCustomer(null);
    navigate('/customer/customer-login');
  };

  const value = {
    isAuthenticated: !!token,
    customer,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {isLoading ? <LoadingFallback /> : children}
    </CustomerAuthContext.Provider>
  );
};