import express from 'express';
import { protectCustomer } from '../../middleware/protectCustomer.js';
import { getMyNotifications, markAllAsRead } from '../../controllers/customerControllers/notificationController.js';

const router = express.Router();

router.use(protectCustomer);

router.get('/', getMyNotifications);
router.post('/mark-all-read', markAllAsRead);

export default router;