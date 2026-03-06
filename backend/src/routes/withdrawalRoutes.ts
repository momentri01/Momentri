import { Router } from 'express';
import { requestWithdrawal, getUserWithdrawals } from '../controllers/withdrawalController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate as any, requestWithdrawal as any);
router.get('/my', authenticate as any, getUserWithdrawals as any);

export default router;
