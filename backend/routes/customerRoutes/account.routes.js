import express from 'express';
import { protectCustomer } from '../../middleware/protectCustomer.js'; 
import { getMyAccountDetails, getMyAccounts } from '../../controllers/customerControllers/account.controller.js';

const router = express.Router();

// /api/customer/accounts -> Müşterinin tüm hesaplarını listeler
router.get('/', protectCustomer, getMyAccounts);

// /api/customer/accounts/123 -> Müşterinin 123 ID'li hesabının detayını getirir
router.get('/:accountId', protectCustomer, getMyAccountDetails);

export default router;