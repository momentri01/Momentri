import { Storage } from '@google-cloud/storage';
import multer from 'multer';

// Initialize with credentials from environment variable
const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket('momentris_upload');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadToGCS = (req: any, res: any, next: any) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) return next();

    const filename = `uploads/${Date.now()}-${req.file.originalname}`;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (err) => next(err));
    blobStream.on('finish', () => {
      req.file.filename = filename;
      next();
    });

    blobStream.end(req.file.buffer);
  });
};
