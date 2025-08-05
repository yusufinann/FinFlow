import apiClient from "./api";

const createPersonnel = async (personnelData) => {
  try {
    const response = await apiClient.post('/', personnelData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Personel oluşturulurken bir sunucu hatası oluştu.');
  }
};

const getAllPersonnels = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Personel bilgileri alınırken bir sunucu hatası oluştu.');
  }
};

const updatePersonnel = async (tckn, personnelData) => {
  try {
    const response = await apiClient.put(`/${tckn}`, personnelData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Personel güncellenirken bir sunucu hatası oluştu.');
  }
};

const requestToggleOtp = async (tckn) => {
  try {
    const response = await apiClient.post(`/${tckn}/request-status-otp`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Onay kodu istenirken bir sunucu hatası oluştu.');
  }
};

const confirmStatusChange = async (tckn, otp) => {
  try {
    const response = await apiClient.post(`/${tckn}/confirm-status-change`, { otp });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('İşlem onaylanırken bir sunucu hatası oluştu.');
  }
};

const personnelService = {
  createPersonnel,
  getAllPersonnels,
  updatePersonnel,
  requestToggleOtp,
  confirmStatusChange,
};

export default personnelService;