// Artık 'getAuthHeader'a ihtiyacımız yok çünkü interceptor bu işi yapıyor.
import apiClient from './api'; // Merkezi API istemcimizi import ediyoruz.

const API_BASE_PATH = '/accounts'; // Rota'nın temel yolu

/**
 * Oturum açmış müşterinin hesaplarını getirir.
 */
const getMyAccounts = async () => {
  try {
    const response = await apiClient.get(API_BASE_PATH);
    return response.data; 
    

  } catch (error) {
    console.error('Error fetching accounts:', error);
    if (error.response && error.response.data) {
      throw error.response.data; 
    }
    throw new Error('Hesaplar alınırken bir sunucu hatası oluştu.');
  }
};

const accountService = {
  getMyAccounts,
};

export default accountService;