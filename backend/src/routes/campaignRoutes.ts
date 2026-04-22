import { Router } from 'express';
import { createCampaign, getOrganizationCampaigns, getCampaignById, updateCampaign, deleteCampaign, sendThankYouNotes, issueTaxReceipts } from '../controllers/campaignController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { Role } from '../types/prisma.js';

const router = Router();

// All campaign routes require authentication and authorization for ADMIN or ORGANIZATION roles
router.use(authenticate as any);
router.use(authorize([Role.ADMIN, Role.ORGANIZATION]) as any);

router.post('/', createCampaign as any);
router.get('/', getOrganizationCampaigns as any);
router.get('/:id', getCampaignById as any);
router.put('/:id', updateCampaign as any);
router.delete('/:id', deleteCampaign as any);

// New endpoints for campaign-specific actions
router.post('/:campaignId/send-thank-you', sendThankYouNotes as any);
router.post('/:campaignId/issue-tax-receipts', issueTaxReceipts as any);

export default router;
