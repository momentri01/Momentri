import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../utils/prisma.js';
import { sendVerificationEmail } from '../utils/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: Request, res: Response) => {
  const { email, password, fullName, country, province, businessName, registrationNumber, isCharity, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        // User exists but not verified, resend code
        const code = generateVerificationCode();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
          where: { email },
          data: {
            verificationCode: code,
            verificationCodeExpires: expires
          }
        });

        await sendVerificationEmail(email, code);
        return res.status(200).json({ message: 'Verification code resent', email });
      }
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        country,
        province,
        businessName,
        registrationNumber,
        isCharity: isCharity || false,
        role: role || 'USER',
        verificationCode: code,
        verificationCodeExpires: expires,
        isEmailVerified: false
      },
    });

    await sendVerificationEmail(email, code);

    res.status(201).json({ message: 'Registration successful. Please check your email for the verification code.', email });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

export const verifyMFA = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ message: 'Verification code expired' });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      }
    });

    const token = jwt.sign(
      { userId: updatedUser.id, role: updatedUser.role, email: updatedUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      user: { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        fullName: updatedUser.fullName, 
        role: updatedUser.role,
        country: updatedUser.country,
        province: updatedUser.province
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const resendCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: code,
        verificationCodeExpires: expires
      }
    });

    await sendVerificationEmail(email, code);

    res.status(200).json({ message: 'Verification code resent' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log(`Login attempt for: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      console.log(`User has no password (likely Google-only): ${email}`);
      return res.status(400).json({ message: 'Please sign in with Google' });
    }

    if (!user.isEmailVerified) {
      console.log(`User email not verified: ${email}`);
      return res.status(403).json({ message: 'Email not verified', email });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      console.log(`Incorrect password for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`Login successful: ${email}`);
    res.status(200).json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error: any) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message || error });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  const { idToken, country, province } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ message: 'Invalid Google token' });

    const { sub: googleId, email, name: fullName, picture: profileImageUrl } = payload;

    if (!email) return res.status(400).json({ message: 'Email not provided by Google' });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: fullName || 'Google User',
          googleId,
          isEmailVerified: true, // Google emails are pre-verified
          profileImageUrl,
          country: country || 'United States',
          province: province || 'Alabama',
          role: 'USER'
        }
      });
    } else if (!user.googleId) {
      // Link Google account to existing email
      user = await prisma.user.update({
        where: { email },
        data: { googleId, isEmailVerified: true }
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role,
        country: user.country,
        province: user.province
      } 
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);
    res.status(500).json({ message: 'Google authentication failed', error });
  }
};
