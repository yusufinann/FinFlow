import express from 'express';
import { login } from '../../controllers/customerControllers/auth.controller.js';
import { requestInitialPasswordOTP, setInitialPassword } from '../../controllers/customerControllers/password.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/password/request-otp', requestInitialPasswordOTP);
router.post('/password/set-initial', setInitialPassword);

export default router;