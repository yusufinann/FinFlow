import apiClient from "./api"

const createAccount=async(accounData)=>{
    try {
        const response=await apiClient.post('/accounts',accounData);
        return response.data;
    } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Müşteri oluşturulurken bir sunucu hatası oluştu.');
  }
};

const accountService = {
createAccount
};
export default  accountService;