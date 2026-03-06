import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const createCatalogItem = async (req: Request, res: Response) => {
  const { name, description, category, price, currency, imageUrl, imageUrls } = req.body;
  try {
    const item = await prisma.catalogItem.create({
      data: { 
        name, 
        description, 
        category, 
        price, 
        currency: currency || 'USD', 
        imageUrl: imageUrl || (imageUrls && JSON.parse(imageUrls)[0]) || null,
        imageUrls: imageUrls || '[]'
      },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating catalog item', error });
  }
};

export const getAllCatalogItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.catalogItem.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    
    // Parse imageUrls if they are stored as JSON string
    const parsedItems = items.map(item => ({
      ...item,
      imageUrls: JSON.parse(item.imageUrls || '[]')
    }));

    res.json(parsedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching catalog', error });
  }
};

export const updateCatalogItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = { ...req.body };
  
  if (data.imageUrls && typeof data.imageUrls !== 'string') {
    data.imageUrls = JSON.stringify(data.imageUrls);
  }

  try {
    const item = await prisma.catalogItem.update({
      where: { id: id as string },
      data: data,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
};

export const deleteCatalogItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.catalogItem.update({
      where: { id: id as string },
      data: { isActive: false },
    });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};
