import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dns from 'node:dns';

// Force IPv4 as priority for all network connections
// This fixes ESOCKET ENETUNREACH errors on IPv6 in many cloud environments
dns.setDefaultResultOrder('ipv4first');

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { handleStripeWebhook } from './controllers/stripeWebhookController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

dotenv.config();

console.log("ENV CHECK:", {
  DATABASE_URL: process.env.DATABASE_URL ? "SET" : "UNDEFINED",
  JWT_SECRET: process.env.JWT_SECRET ? "SET" : "UNDEFINED",
});

const app: Express = express();
const port = process.env.PORT || 8000;

const allowedOrigins = [
  (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  'https://www.momentris.com',
  'https://momentris.com'
];

console.log("CORS CHECK: Allowed Origins are", allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Set COOP header for Google Auth popups
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Webhook must be before express.json()
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Momentris Backend API is running!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
