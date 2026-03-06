import { Router } from 'express';
import { addToWishlist, purchaseWishlistItem, getEventWishlist, markPurchaseAsSuccessful } from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate as any, addToWishlist as any);
router.post('/purchase', purchaseWishlistItem);
router.post('/purchase/:id/success', markPurchaseAsSuccessful);
router.get('/event/:eventId', getEventWishlist);

export default router;
