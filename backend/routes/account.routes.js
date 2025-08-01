import express from 'express';
import authenticateUser from '../middleware/authenticateUser.js'
import { createAccount } from '../controllers/personnelControllers/account.controller.js';
const router = express.Router();
router.post('/', authenticateUser, createAccount);
export default router;