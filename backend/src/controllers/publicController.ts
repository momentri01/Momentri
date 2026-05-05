import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const [
      donationStats,
      purchaseStats,
      activeEvents,
      donationCount,
      purchaseCount
    ] = await Promise.all([
      prisma.donation.aggregate({
        where: { paymentStatus: 'SUCCESSFUL' },
        _sum: { grossAmount: true }
      }),
      prisma.wishlistPurchase.aggregate({
        where: { paymentStatus: 'SUCCESSFUL' },
        _sum: { grossAmount: true }
      }),
      prisma.event.count({
        where: { status: 'ACTIVE', visibility: 'PUBLIC' }
      }),
      prisma.donation.count({
        where: { paymentStatus: 'SUCCESSFUL' }
      }),
      prisma.wishlistPurchase.count({
        where: { paymentStatus: 'SUCCESSFUL' }
      })
    ]);

    const totalRaised = (donationStats._sum.grossAmount || 0) + (purchaseStats._sum.grossAmount || 0);
    const activeSupporters = donationCount + purchaseCount;

    res.json({
      totalRaised,
      activeSupporters,
      activeEvents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform stats', error });
  }
};

export const getTopEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        visibility: 'PUBLIC',
        status: 'ACTIVE',
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: {
          select: { fullName: true }
        },
        donations: {
          where: { paymentStatus: 'SUCCESSFUL' },
          select: { grossAmount: true }
        }
      }
    });

    const eventsWithTotals = events.map(event => {
      const totalRaised = event.donations.reduce((sum, d) => sum + d.grossAmount, 0);
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        slug: event.slug,
        coverImageUrl: event.coverImageUrl,
        donationGoal: event.donationGoal,
        currency: event.currency,
        totalRaised,
        ownerName: event.owner.fullName,
        createdAt: event.createdAt
      };
    });

    res.json(eventsWithTotals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top events', error });
  }
};
