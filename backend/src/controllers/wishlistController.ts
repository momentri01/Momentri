import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const addToWishlist = async (req: AuthRequest, res: Response) => {
    const { eventId, catalogItemId, quantityRequested } = req.body;
    const userId = req.user?.userId;

    try {
        const event = await prisma.event.findFirst({ where: { id: eventId, ownerId: userId } });
        if (!event) return res.status(403).json({ message: 'Unauthorized' });

        const catalogItem = await prisma.catalogItem.findUnique({ where: { id: catalogItemId } });
        if (!catalogItem) return res.status(404).json({ message: 'Catalog item not found' });

        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                eventId,
                catalogItemId,
                itemName: catalogItem.name,
                itemDescription: catalogItem.description,
                itemImageUrl: catalogItem.imageUrl,
                price: catalogItem.price,
                currency: catalogItem.currency,
                quantityRequested,
                quantityPurchased: 0,
            },
        });

        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error });
    }
};

export const purchaseWishlistItem = async (req: Request, res: Response) => {
    const { wishlistItemId, buyerName, buyerEmail, quantity, isAnonymous, message } = req.body;

    try {
        const item = await prisma.wishlistItem.findUnique({ where: { id: wishlistItemId } });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const grossAmount = Number(item.price) * Number(quantity);
        const platformFee = 0; // Zero fee for registry items
        const netAmount = grossAmount;

        const purchase = await prisma.wishlistPurchase.create({
            data: {
                eventId: item.eventId,
                wishlistItemId: item.id,
                itemName: item.itemName,
                buyerName,
                buyerEmail,
                quantity,
                grossAmount,
                platformFee,
                netAmount,
                currency: item.currency,
                paymentMethod: 'STRIPE',
                paymentStatus: 'PENDING',
                isAnonymous: isAnonymous || false,
                message,
            },
        });

        res.status(201).json(purchase);
    } catch (error) {
        res.status(500).json({ message: 'Error processing purchase', error });
    }
};

export const markPurchaseAsSuccessful = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const purchase = await prisma.wishlistPurchase.update({
            where: { id: id as string },
            data: { paymentStatus: 'SUCCESSFUL' }
        });

        // Update wishlist item quantity
        await prisma.wishlistItem.update({
            where: { id: purchase.wishlistItemId },
            data: {
                quantityPurchased: { increment: purchase.quantity }
            }
        });

        // Update event total wishlist value
        await prisma.event.update({
            where: { id: purchase.eventId },
            data: {
                totalWishlistValue: { increment: purchase.grossAmount }
            }
        });

        res.json({ message: 'Purchase successful', purchase });
    } catch (error) {
        res.status(500).json({ message: 'Error updating purchase', error });
    }
};

export const getEventWishlist = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    try {
        const items = await prisma.wishlistItem.findMany({
            where: { eventId: eventId as string },
            orderBy: { createdAt: 'desc' },
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error });
    }
};
