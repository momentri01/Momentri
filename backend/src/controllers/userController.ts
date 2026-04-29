import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';
import { stripe, FRONTEND_URL } from '../utils/stripe.js';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        fullName: true, 
        role: true, 
        deliveryAddress: true, 
        payoutInfo: true,
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        bio: true,
        phoneNumber: true,
        profileImageUrl: true,
        country: true,
        province: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { fullName, deliveryAddress, payoutInfo, bio, phoneNumber, profileImageUrl, country, province } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { fullName, deliveryAddress, payoutInfo, bio, phoneNumber, profileImageUrl, country, province },
      select: { 
        id: true, 
        email: true, 
        fullName: true, 
        role: true, 
        deliveryAddress: true, 
        payoutInfo: true,
        stripeAccountId: true,
        stripeOnboardingComplete: true,
        bio: true,
        phoneNumber: true,
        profileImageUrl: true,
        country: true,
        province: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.passwordHash) {
      return res.status(400).json({ message: 'This account uses Google Login. Please use Google to sign in or set a password through Forgot Password.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};

export const createStripeAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const email = req.user?.email;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let stripeAccountId = user.stripeAccountId;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: email,
        business_type: 'individual',
        capabilities: {
          transfers: { requested: true },
        },
      });
      stripeAccountId = account.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeAccountId }
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${FRONTEND_URL}/dashboard`,
      return_url: `${FRONTEND_URL}/dashboard?stripe_onboarding_success=true`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect Error:', error);
    res.status(500).json({ message: 'Error creating Stripe account link', error });
  }
};

export const checkStripeStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeAccountId) {
      return res.json({ onboardingComplete: false });
    }

    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    const onboardingComplete = account.details_submitted;

    if (onboardingComplete && !user.stripeOnboardingComplete) {
      await prisma.user.update({
        where: { id: userId },
        data: { stripeOnboardingComplete: true }
      });
    }

    res.json({ onboardingComplete });
  } catch (error) {
    res.status(500).json({ message: 'Error checking Stripe status', error });
  }
};
