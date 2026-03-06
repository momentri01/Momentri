import { Router } from 'express';
import { createCatalogItem, getAllCatalogItems, updateCatalogItem, deleteCatalogItem } from '../controllers/catalogController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { Role } from '../types/prisma.js';

const router = Router();

router.get('/', getAllCatalogItems);
router.post('/', authenticate as any, authorize([Role.ADMIN]) as any, createCatalogItem as any);
router.put('/:id', authenticate as any, authorize([Role.ADMIN]) as any, updateCatalogItem as any);
router.delete('/:id', authenticate as any, authorize([Role.ADMIN]) as any, deleteCatalogItem as any);

export default router;
