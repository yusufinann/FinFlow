import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js'
import { createCustomer, getAllCustomers, getCustomerDetails, updateCustomer } from '../controllers/personnelControllers/customer.controller.js';
const router = express.Router();
router.post('/', authenticateUser, createCustomer);
router.get('/all', authenticateUser, getAllCustomers);
router.get('/:tckn', authenticateUser, getCustomerDetails);
router.put('/:tckn', authenticateUser, updateCustomer);
export default router;