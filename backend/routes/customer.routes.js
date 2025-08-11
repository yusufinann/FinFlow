import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js'
// GÜNCELLENDİ: Yeni fonksiyonlar import edildi
import { 
    createCustomer, 
    getAllCustomers, 
    getCustomerDetails, 
    updateCustomer,
    requestToggleCustomerStatusOTP, 
    confirmToggleCustomerStatus     
} from '../controllers/personnelControllers/customer.controller.js';

const router = express.Router();

// Mevcut Rotalar
router.post('/', authenticateUser, createCustomer);
router.get('/all', authenticateUser, getAllCustomers);
router.get('/:tckn', authenticateUser, getCustomerDetails);
router.put('/:tckn', authenticateUser, updateCustomer);
router.post('/:tckn/request-toggle-otp', authenticateUser, requestToggleCustomerStatusOTP);
router.post('/:tckn/confirm-toggle', authenticateUser, confirmToggleCustomerStatus);


export default router;