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
}

const getAllPersonnels = async ()=>{
  try {
    const response =await apiClient.get('/');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Personel bilgileri alınırken bir sunucu hatası oluştu.');
  }
}

const personnelService = {
  createPersonnel,
  getAllPersonnels
};

export default personnelService;