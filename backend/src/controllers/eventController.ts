import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';
import { Visibility, EventStatus } from '../types/prisma.js';

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    eventType,
    eventDate,
    donationGoal,
    currency,
    visibility,
    country,
    province,
    coverImageUrl,
    wishlistItems // Array of { catalogItemId, quantityRequested }
  } = req.body;
  const userId = req.user?.userId;

  // Strict currency validation
  const expectedCurrency = country === 'Canada' ? 'CAD' : 'USD';
  if (currency !== expectedCurrency) {
      return res.status(400).json({ message: `Currency must be ${expectedCurrency} for ${country}` });
  }

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
      let slug = generateSlug(title);
      const existingEvent = await prisma.event.findUnique({ where: { slug } });
      if (existingEvent) {
          slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const isHighValue = Number(donationGoal) >= 10000;
      
      const event = await prisma.event.create({
          data: {
              title,
              description,
              eventType,
              eventDate: new Date(eventDate),
              donationGoal: Number(donationGoal),
              currency: currency || 'USD',
              visibility: visibility || Visibility.PUBLIC,
              country,
              province,
              coverImageUrl,
              slug,
              ownerId: userId,
              verificationStatus: isHighValue ? 'PENDING' : 'NONE',
              isVerified: false,
              wishlistItems: {
                  create: await Promise.all((wishlistItems || []).map(async (item: any) => {
                      const catalogItem = await prisma.catalogItem.findUnique({ where: { id: item.catalogItemId } });
                      return {
                          catalogItemId: item.catalogItemId,
                          itemName: catalogItem!.name,
                          itemDescription: catalogItem!.description,
                          itemImageUrl: catalogItem!.imageUrl,
                          price: catalogItem!.price,
                          currency: catalogItem!.currency,
                          quantityRequested: item.quantityRequested,
                      };
                  }))
              }
          },
      });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
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

export const getMyEvents = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const events = await prisma.event.findMany({
      where: { ownerId: userId, NOT: { status: EventStatus.DELETED } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const getPublicEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { 
        visibility: Visibility.PUBLIC, 
        status: EventStatus.ACTIVE 
      },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { fullName: true }
        }
      }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public events', error });
  }
};

export const getEventBySlugOrId = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    const id = identifier as string;
    // Try finding by ID first
    let event = await prisma.event.findUnique({
      where: { id },
      include: {
        owner: { select: { fullName: true, email: true, businessName: true } },
        wishlistItems: {
          include: { catalogItem: true }
        },
        donations: {
          where: { paymentStatus: 'SUCCESSFUL' },
          select: {
            grossAmount: true,
            netAmount: true,
            currency: true,
            paymentStatus: true,
            donorName: true,
            message: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    }) as any;

    // If not found by ID, try finding by slug
    if (!event) {
      event = await prisma.event.findUnique({
        where: { slug: id },
        include: {
          owner: { select: { fullName: true, email: true, businessName: true } },
          wishlistItems: {
            include: { catalogItem: true }
          },
          donations: {
            where: { paymentStatus: 'SUCCESSFUL' },
            select: {
              grossAmount: true,
              netAmount: true,
              currency: true,
              paymentStatus: true,
              donorName: true,
              message: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      }) as any;
    }

    if (!event || event.status === EventStatus.DELETED) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Aggregate donation data
    let totalDonationsGross = 0;
    let totalDonationsNet = 0;
    let successfulDonationsCount = 0;

    const donations = (event as any).donations;
    if (donations && Array.isArray(donations)) {
      donations.forEach((donation: any) => {
        totalDonationsGross += donation.grossAmount;
        totalDonationsNet += donation.netAmount;
        successfulDonationsCount++;
      });
    }

    const eventDetails = {
      ...event,
      totalDonationsGross,
      totalDonationsNet,
      successfulDonationsCount,
    };

    res.json(eventDetails);
  } catch (error: any) {
    console.error(`Error fetching event by identifier (${identifier}):`, error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};
