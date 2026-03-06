import { Router } from 'express';
import { getAdminStats, getAllEventsAdmin, getAllWithdrawalsAdmin, updateWithdrawalStatus, getAllOrdersAdmin, updateOrderStatus, getAllReportsAdmin, updateReportStatus, deleteEventAdmin, toggleEventVerification } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { Role } from '../types/prisma.js';

const router = Router();

router.use(authenticate as any);
router.use(authorize([Role.ADMIN]) as any);

router.get('/stats', getAdminStats as any);
router.get('/events', getAllEventsAdmin as any);
router.put('/events/:id/verify', toggleEventVerification as any);
router.get('/withdrawals', getAllWithdrawalsAdmin as any);
router.put('/withdrawals/:id', updateWithdrawalStatus as any);
router.get('/orders', getAllOrdersAdmin as any);
router.put('/orders/:id', updateOrderStatus as any);
router.get('/reports', getAllReportsAdmin as any);
router.put('/reports/:id', updateReportStatus as any);
router.delete('/events/:id', deleteEventAdmin as any);

export default router;
