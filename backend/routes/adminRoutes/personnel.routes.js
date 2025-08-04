import express from 'express';
import { createPersonnel, getAllPersonnels } from '../../controllers/adminControllers/personnel.controller.js';
import authenticateUser from '../../middleware/authenticateUser.js';
const router = express.Router();
router.post('/', authenticateUser, createPersonnel);
router.get('/', authenticateUser, getAllPersonnels);

export default router;