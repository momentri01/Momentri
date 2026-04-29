import { Router } from 'express';
import { login, register, verifyMFA, resendCode, googleAuth } from '../controllers/authController.js';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.post('/verify-mfa', verifyMFA as any);
router.post('/resend-code', resendCode as any);
router.post('/google', googleAuth as any);

export default router;
