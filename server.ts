import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';

const PORT = 3000;
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Set up multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer limits: 5MB maximum file size
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

async function startServer() {
  const app = express();

  // API Route for video upload
  app.post('/upload-video', upload.single('video'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided.' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error('Error handling upload:', error);
      res.status(500).json({ error: 'Failed to upload video.' });
    }
  });
  
  // Error handler for API routes
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    if (req.path.startsWith('/api/') || req.path === '/upload-video') {
      const statusCode = err.status || 500;
      let errorMessage = 'Internal Server Error';
      
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
        }
        errorMessage = `Upload error: ${err.message}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return res.status(statusCode).json({ error: errorMessage });
    }
    next(err);
  });

  // Serve uploaded files explicitly
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Provide a fallback for SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
