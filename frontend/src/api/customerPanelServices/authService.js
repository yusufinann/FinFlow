// api/authService.js (Güncel Hali)

import apiClient from './api';

const login = async (customer_number, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      customer_number,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Giriş yapılırken bir sorun oluştu.');
  }
};

const logout = () => {
  localStorage.removeItem('customerFinToken');
};

const requestInitialPasswordOTP = async (customer_number, tckn) => {
  try {
    const response = await apiClient.post('/auth/password/request-otp', {
      customer_number,
      tckn,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('OTP istenilirken bir sorun oluştu.');
  }
};

const setInitialPassword = async (customer_number, otp, newPassword) => {
  try {
    const response = await apiClient.post('/auth/password/set-initial', {
      customer_number,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Şifre belirlenirken bir sorun oluştu.');
  }
};
export const getAuthHeader = () => {
  const token = localStorage.getItem('customerFinToken');
  if (token) {
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  }
  return { 'Content-Type': 'application/json' };
};
const authService = {
  login,
  logout,
  requestInitialPasswordOTP,
  setInitialPassword,
};

export default authService;