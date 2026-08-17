import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Upload route
router.post('/', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Construct public URL
  const port = process.env.PORT || 5000;
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.BACKEND_URL || `http://localhost:${port}`
    : `http://localhost:${port}`;
    
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: { url: imageUrl }
  });
});

export default router;
