import api from './api'; 

export const createPersonnelTransfer = async (payload) => {
    const response = await api.post('/transactions/personnel-transfer', payload);
    return response.data;
};

export default  {
    createPersonnelTransfer,    
} 