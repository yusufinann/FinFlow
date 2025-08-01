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
  localStorage.removeItem('personnelFinToken');
};

const register=async(payload)=>{
  try {
    const response=await apiClient.post('/auth/register',
      payload
    )
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data; 
    }
    throw new Error('Giriş yapılırken bir sorun oluştu.');
  }
}

const authService = {
  login,
  logout,
  register
};

export default authService;