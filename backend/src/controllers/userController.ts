import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true, deliveryAddress: true, payoutInfo: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { fullName, deliveryAddress, payoutInfo } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { fullName, deliveryAddress, payoutInfo },
      select: { id: true, email: true, fullName: true, role: true, deliveryAddress: true, payoutInfo: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};
