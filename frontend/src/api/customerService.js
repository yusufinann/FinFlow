import apiClient from './api';

const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Müşteri oluşturulurken bir sunucu hatası oluştu.');
  }
};

const getCustomerByTckn = async (tckn) => {
  if (!tckn) {
    throw new Error('Lütfen bir TCKN giriniz.');
  }
  try {
    const response = await apiClient.get(`/customers/${tckn}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Müşteri sorgulanırken bir sunucu hatası oluştu.');
  }
};

const updateCustomer = async (tckn, customerData) => {
  try {
    const response = await apiClient.put(`/customers/${tckn}`, customerData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Müşteri bilgileri güncellenirken bir sunucu hatası oluştu.');
  }
};

const updateAccount = async (accountId, accountData) => {
  try {
    const response = await apiClient.put(`/accounts/${accountId}`, accountData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Hesap bilgileri güncellenirken bir sunucu hatası oluştu.');
  }
};

const getAllCustomers = async () => {
  try {
    const response = await apiClient.get('/customers/all');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Müşteriler listelenirken bir sunucu hatası oluştu.');
  }
};


const customerService = {
  createCustomer,
  getCustomerByTckn,
  updateCustomer,
  updateAccount,
  getAllCustomers
};

export default customerService;