import { Router } from 'express';
import { createEvent, getMyEvents, getPublicEvents, getEventBySlugOrId } from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate as any, createEvent as any);
router.get('/my', authenticate as any, getMyEvents as any);
router.get('/public', getPublicEvents as any);
router.get('/:identifier', getEventBySlugOrId as any);

export default router;
