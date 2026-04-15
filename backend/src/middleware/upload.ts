import { Storage } from '@google-cloud/storage';
import multer from 'multer';

const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || 'momentri-uploads');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadToGCS = (req: any, res: any, next: any) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(err);
    if (!req.file) return next();

    const blob = bucket.file(`uploads/${Date.now()}-${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (err) => next(err));
    blobStream.on('finish', () => {
      req.file.filename = blob.name; // Path to file in bucket
      next();
    });

    blobStream.end(req.file.buffer);
  });
};
