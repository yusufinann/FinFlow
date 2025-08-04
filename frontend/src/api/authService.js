import apiClient from './api';


const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username, 
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
  sessionStorage.removeItem('personnelFinToken');
};


const requestInitialPasswordOTP = async (username, tckn) => {
  try {
    const response = await apiClient.post('/auth/password/request-otp', {
      username,
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

const setInitialPassword = async (username, otp, newPassword) => {
  try {
    const response = await apiClient.post('/auth/password/set-initial', {
      username,
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

const authService = {
  login,
  logout,
  setInitialPassword,
  requestInitialPasswordOTP
};

export default authService;