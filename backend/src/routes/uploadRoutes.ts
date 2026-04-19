import { Router, Request, Response } from 'express';
import { Storage } from '@google-cloud/storage';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const storage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}'),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});
const bucket = storage.bucket('momentriss_upload');

router.post('/', authenticate as any, (req: Request, res: Response, next: any) => {
  upload.single('image')(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    const filename = `uploads/${Date.now()}-${req.file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (error) => res.status(500).json({ message: error.message }));
    blobStream.on('finish', () => {
        const imageUrl = `https://storage.googleapis.com/momentriss_upload/${filename}`;
        res.status(200).json({ imageUrl });
    });
    blobStream.end(req.file.buffer);
  });
});

router.post('/multiple', authenticate as any, (req: Request, res: Response, next: any) => {
  upload.array('images', 5)(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const files = req.files as Express.Multer.File[];
    const imageUrls = await Promise.all(files.map(async (file) => {
        const filename = `uploads/${Date.now()}-${file.originalname}`;
        const blob = bucket.file(filename);
        await blob.save(file.buffer, { contentType: file.mimetype });
        return `https://storage.googleapis.com/momentriss_upload/${filename}`;
    }));
    
    res.status(200).json({ imageUrls });
  });
});

export default router;
