import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { PaymentStatus } from '../types/prisma.js';

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
        currency,
        paymentMethod: 'STRIPE', // Default for now
        paymentStatus: PaymentStatus.PENDING,
        message,
      },
    });

    // In a real app, you'd create a Stripe PaymentIntent here
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error });
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

        // Update event totals
        await prisma.event.update({
            where: { id: donation.eventId },
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
