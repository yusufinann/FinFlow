import { Router } from 'express';
import { createPersonnelTransfer } from '../controllers/personnelControllers/transaction.controller.js';

// Bu rotaya erişimin sadece yetkili personel tarafından yapılmasını sağlamak için
// bir 'authMiddleware' kullanmanız şiddetle tavsiye edilir.
// import { isPersonnel } from '../middlewares/authMiddleware.js'; 

const router = Router();

// POST /api/transactions/personnel-transfer
// Bu endpoint, personelin müşteri adına para göndermesi için kullanılır.
router.post(
    '/personnel-transfer', 
    createPersonnelTransfer
);

export default router;