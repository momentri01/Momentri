import { Router } from 'express';
import { getPlatformStats, getTopEvents } from '../controllers/publicController.js';

const router = Router();

router.get('/stats', getPlatformStats);
router.get('/top-events', getTopEvents);

export default router;
