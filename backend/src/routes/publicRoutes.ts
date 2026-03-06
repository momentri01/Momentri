import { Router } from 'express';
import { getPlatformStats } from '../controllers/publicController.js';

const router = Router();

router.get('/stats', getPlatformStats);

export default router;
