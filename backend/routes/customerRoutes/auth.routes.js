import express from 'express';
import { getCustomerProfile, login } from '../../controllers/customerControllers/auth.controller.js';
import { requestInitialPasswordOTP, setInitialPassword } from '../../controllers/customerControllers/password.controller.js';
import { protectCustomer } from '../../middleware/protectCustomer.js';

const router = express.Router();

router.post('/login', login);
router.get('/profile',protectCustomer, getCustomerProfile);
router.post('/password/request-otp', requestInitialPasswordOTP);
router.post('/password/set-initial', setInitialPassword);

export default router;