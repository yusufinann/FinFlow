import express from 'express';
import { protectCustomer } from '../../middleware/protectCustomer.js';
import { createCustomerTransfer, getDashboardSummary, getIncomeExpenseSummary, getRecentTransactions } from '../../controllers/customerControllers/transaction.controller.js';


const router = express.Router();

router.get('/', protectCustomer, getRecentTransactions);
router.get('/summary',protectCustomer, getDashboardSummary);
router.post('/transfer', protectCustomer, createCustomerTransfer);
router.get('/income-expense-summary', protectCustomer, getIncomeExpenseSummary);

export default router;