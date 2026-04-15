import { Router } from 'express';
import { getProfile, updateProfile, createStripeAccount, checkStripeStatus } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate as any, getProfile as any);
router.put('/profile', authenticate as any, updateProfile as any);
router.post('/change-password', authenticate as any, changePassword as any);
router.post('/stripe/connect', authenticate as any, createStripeAccount as any);
router.get('/stripe/status', authenticate as any, checkStripeStatus as any);

export default router;
