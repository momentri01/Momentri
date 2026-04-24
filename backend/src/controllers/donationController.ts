import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { PaymentStatus } from '../types/prisma.js';
import { stripe, FRONTEND_URL } from '../utils/stripe.js';

export const createDonation = async (req: Request, res: Response) => {
  const { eventId, donorName, donorEmail, isAnonymous, grossAmount, currency, message } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if goal reached
    if (Number(event.totalDonationsNet) >= Number(event.donationGoal)) {
      return res.status(400).json({ message: 'This fundraiser has already reached its goal and is no longer accepting donations.' });
    }

    // Platform fee calculation (e.g., 10%)
    const platformFee = Number(grossAmount) * 0.1;
    const netAmount = Number(grossAmount) - platformFee;

    const donation = await prisma.donation.create({
      data: {
        eventId,
        donorName,
        donorEmail,
        isAnonymous: isAnonymous || false,
        grossAmount,
        platformFee,
        netAmount,
        currency: currency || 'USD',
        paymentMethod: 'STRIPE',
        paymentStatus: PaymentStatus.PENDING,
        message,
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency?.toLowerCase() || 'usd',
            product_data: {
              name: `Donation to ${event.title}`,
              description: `Support ${event.ownerId}'s fundraiser`,
            },
            unit_amount: Math.round(Number(grossAmount) * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: donorEmail,
      success_url: `${FRONTEND_URL}/public-event/${event.slug}?donation_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/public-event/${event.slug}?donation_cancel=true`,
      metadata: {
        donationId: donation.id,
        eventId: event.id,
        type: 'donation',
      },
    });

    res.status(201).json({ url: session.url, donationId: donation.id });
  } catch (error) {
    console.error('Stripe Donation Error:', error);
    res.status(500).json({ message: 'Error creating donation checkout session', error });
  }
};

export const getEventDonations = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  try {
    const donations = await prisma.donation.findMany({
      where: { eventId: eventId as string, paymentStatus: PaymentStatus.SUCCESSFUL },
      orderBy: { createdAt: 'desc' },
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error });
  }
};

// Mock function for simulating payment success (for development)
export const markDonationAsSuccessful = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const donation = await prisma.donation.update({
            where: { id: id as string },
            data: { paymentStatus: PaymentStatus.SUCCESSFUL }
        });

        if (!donation.eventId) {
            return res.json({ message: 'Donation successful (no event linked)', donation });
        }
        const eventId = donation.eventId; // Extract to local const for TypeScript narrowing

        // Update event totals
        await prisma.event.update({
            where: { id: eventId },
            data: {
                totalDonationsGross: { increment: donation.grossAmount },
                totalPlatformFees: { increment: donation.platformFee },
                totalDonationsNet: { increment: donation.netAmount }
            }
        });

        res.json({ message: 'Donation successful', donation });
    } catch (error) {
        res.status(500).json({ message: 'Error updating donation', error });
    }
};
