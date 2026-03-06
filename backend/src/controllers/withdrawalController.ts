import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { eventId, amount, payoutMethod, payoutDetails } = req.body;

  try {
    const event = await prisma.event.findFirst({
      where: { id: eventId, ownerId: userId }
    });

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Validate balance
    if (Number(amount) > Number(event.totalDonationsNet)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: userId!,
        userEmail: req.user!.email,
        eventId,
        eventTitle: event.title,
        amount: Number(amount),
        currency: event.currency,
        payoutMethod,
        payoutDetails: JSON.stringify(payoutDetails),
        status: 'PENDING'
      }
    });

    // Optionally deduct immediately or wait for processing
    // For this logic, we will deduct upon "PROCESSED" status in admin controller
    
    res.status(201).json(withdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating withdrawal request', error });
  }
};

export const getUserWithdrawals = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawals', error });
  }
};
