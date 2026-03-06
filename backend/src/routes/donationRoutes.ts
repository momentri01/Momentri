import { Router } from 'express';
import { createDonation, getEventDonations, markDonationAsSuccessful } from '../controllers/donationController.js';

const router = Router();

router.post('/', createDonation);
router.get('/event/:eventId', getEventDonations);
router.post('/:id/success', markDonationAsSuccessful); // Dev only mock

export default router;
