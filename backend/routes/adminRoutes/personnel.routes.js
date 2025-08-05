import express from 'express';
import { 
    createPersonnel, 
    getActivityLogs, 
    getAllPersonnels, 
    getPersonelByTckn,
    updatePersonnel,
    requestToggleStatusOTP,
    confirmToggleStatus
} from '../../controllers/adminControllers/personnel.controller.js';
import authenticateUser from '../../middleware/authenticateUser.js';

const router = express.Router();

router.post('/', authenticateUser, createPersonnel);
router.get('/', authenticateUser, getAllPersonnels);
router.get('/activity-logs', authenticateUser, getActivityLogs);
router.get('/:tckn', authenticateUser, getPersonelByTckn);
router.put('/:tckn', authenticateUser, updatePersonnel);
router.post('/:tckn/request-status-otp', authenticateUser, requestToggleStatusOTP);
router.post('/:tckn/confirm-status-change', authenticateUser, confirmToggleStatus);

export default router;