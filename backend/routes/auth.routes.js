import express from 'express';
import { getPersonnelProfile, login,logout, requestPasswordReset, resetPassword, verifyResetCode} from '../controllers/personnelControllers/auth.controller.js';
import { requestInitialPasswordOTP, setInitialPassword } from '../controllers/personnelControllers/password.controller.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/password/request-otp', requestInitialPasswordOTP);
router.post('/password/set-initial', setInitialPassword);

router.post('/forgot-password/request', requestPasswordReset);
router.post('/forgot-password/verify', verifyResetCode);
router.post('/forgot-password/reset', resetPassword);

router.get('/personnel-details',authenticateUser, getPersonnelProfile);

export default router;
