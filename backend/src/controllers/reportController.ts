import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const createReport = async (req: Request, res: Response) => {
  const { eventId, reporterEmail, reason, details } = req.body;

  try {
    const report = await prisma.report.create({
      data: {
        eventId,
        reporterEmail,
        reason,
        details,
      }
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting report', error });
  }
};
