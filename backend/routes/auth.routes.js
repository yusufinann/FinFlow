import express from 'express';
import { login,logout} from '../controllers/personnelControllers/auth.controller.js';
import { requestInitialPasswordOTP, setInitialPassword } from '../controllers/personnelControllers/password.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/password/request-otp', requestInitialPasswordOTP);
router.post('/password/set-initial', setInitialPassword);

export default router;
