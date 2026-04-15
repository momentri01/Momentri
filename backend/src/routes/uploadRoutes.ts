import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate as any, (req: Request, res: Response, next: any) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const baseUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'http://localhost:8001';
    const imageUrl = `${baseUrl.replace('https://momentri-4zt6.vercel.app', 'https://momentri-production.up.railway.app')}/uploads/${req.file.filename}`;
    console.log('Upload Success:', imageUrl);
    res.status(200).json({ imageUrl });
  });
});

router.post('/multiple', authenticate as any, (req: Request, res: Response, next: any) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload Error:', err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const baseUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'http://localhost:8001';
    const imageUrls = (req.files as Express.Multer.File[]).map(file => 
      `${baseUrl.replace('https://momentri-4zt6.vercel.app', 'https://momentri-production.up.railway.app')}/uploads/${file.filename}`
    );
    
    res.status(200).json({ imageUrls });
  });
});

export default router;
