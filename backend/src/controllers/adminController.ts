import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalEvents = await prisma.event.count();
    const totalDonations = await prisma.donation.count({ where: { paymentStatus: 'SUCCESSFUL' } });
    const totalGross = await prisma.donation.aggregate({
      where: { paymentStatus: 'SUCCESSFUL' },
      _sum: { grossAmount: true }
    });
    const totalNet = await prisma.donation.aggregate({
      where: { paymentStatus: 'SUCCESSFUL' },
      _sum: { netAmount: true }
    });
    const pendingWithdrawals = await prisma.withdrawal.count({ where: { status: 'PENDING' } });

    res.json({
      totalEvents,
      totalDonations,
      totalGross: totalGross._sum.grossAmount || 0,
      totalNet: totalNet._sum.netAmount || 0,
      pendingWithdrawals
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats', error });
  }
};

export const getAllEventsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: { owner: { select: { fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const getAllWithdrawalsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching withdrawals', error });
  }
};

export const getAllOrdersAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.wishlistPurchase.findMany({
      where: { paymentStatus: 'SUCCESSFUL' },
      include: {
        event: {
          include: {
            owner: {
              select: { fullName: true, email: true, deliveryAddress: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const updateWithdrawalStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  try {
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: id as string } });
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: id as string },
      data: { 
        status, 
        adminNotes, 
        processedAt: status === 'PROCESSED' ? new Date() : null 
      }
    });

    // If processed, update withdrawnAmount
    if (status === 'PROCESSED') {
      await prisma.event.update({
        where: { id: withdrawal.eventId },
        data: {
          withdrawnAmount: { increment: withdrawal.amount }
        }
      });
    }

    res.json(updatedWithdrawal);
  } catch (error) {
    res.status(500).json({ message: 'Error updating withdrawal', error });
  }
};

export const getAllReportsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        event: {
          select: { title: true, slug: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error });
  }
};

export const deleteEventAdmin = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.event.update({
      where: { id: id as string },
      data: { status: 'DELETED' }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const report = await prisma.report.update({
      where: { id: id as string },
      data: { status }
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { fulfillmentStatus } = req.body;
  try {
    const order = await prisma.wishlistPurchase.update({
      where: { id: id as string },
      data: { fulfillmentStatus }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

export const toggleEventVerification = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { isVerified, status } = req.body; // status: VERIFIED or REJECTED
  
  try {
    const event = await prisma.event.update({
      where: { id: id as string },
      data: { 
        isVerified: !!isVerified,
        verificationStatus: status || (isVerified ? 'VERIFIED' : 'NONE')
      }
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling verification', error });
  }
};
