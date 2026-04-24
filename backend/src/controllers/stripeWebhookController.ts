import { Request, Response } from 'express';
import { stripe } from '../utils/stripe.js';
import prisma from '../utils/prisma.js';
import { PaymentStatus } from '../types/prisma.js';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const metadata = session.metadata;

    if (metadata.type === 'donation') {
      await handleDonationSuccess(metadata.donationId, session.id);
    } else if (metadata.type === 'wishlist_purchase') {
      await handleWishlistPurchaseSuccess(metadata.purchaseId, session.id);
    }
  }

  res.json({ received: true });
};

async function handleDonationSuccess(donationId: string, sessionId: string) {
  try {
    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation || donation.paymentStatus === PaymentStatus.SUCCESSFUL) return;
    if (!donation.eventId) return; // Skip if no event linked

    await prisma.$transaction(async (tx) => {
      await tx.donation.update({
        where: { id: donationId },
        data: { 
          paymentStatus: PaymentStatus.SUCCESSFUL,
          transactionReference: sessionId
        }
      });

      await tx.event.update({
        where: { id: donation.eventId },
        data: {
          totalDonationsGross: { increment: donation.grossAmount },
          totalPlatformFees: { increment: donation.platformFee },
          totalDonationsNet: { increment: donation.netAmount }
        }
      });
    });
    console.log(`Donation ${donationId} processed successfully`);
  } catch (error) {
    console.error(`Error processing donation success:`, error);
  }
}

async function handleWishlistPurchaseSuccess(purchaseId: string, sessionId: string) {
  try {
    const purchase = await prisma.wishlistPurchase.findUnique({ where: { id: purchaseId } });
    if (!purchase || purchase.paymentStatus === PaymentStatus.SUCCESSFUL) return;

    await prisma.$transaction(async (tx) => {
      await tx.wishlistPurchase.update({
        where: { id: purchaseId },
        data: { 
          paymentStatus: PaymentStatus.SUCCESSFUL,
          transactionReference: sessionId
        }
      });

      await tx.wishlistItem.update({
        where: { id: purchase.wishlistItemId },
        data: {
          quantityPurchased: { increment: purchase.quantity }
        }
      });

      await tx.event.update({
        where: { id: purchase.eventId },
        data: {
          totalWishlistValue: { increment: purchase.grossAmount }
        }
      });
    });
    console.log(`Wishlist purchase ${purchaseId} processed successfully`);
  } catch (error) {
    console.error(`Error processing wishlist purchase success:`, error);
  }
}
