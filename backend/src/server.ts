import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import sanityImportRoutes from './controllers/sanityImportRoutes.js';
import { connectToDatabase } from './lib/db/mongodb.js';
import { sanityConfigOk } from './lib/sanity/sanity.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Allow-list of known frontend / studio origins.
const staticAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://english-platform-hazaribagh.vercel.app',
  'https://english-platform-hazaribagh.sanity.studio',
];

// Sanity Studio can be hosted on *.sanity.studio (their free hosting) OR
// on your own domain. Allow any *.sanity.studio subdomain plus the
// static list above, and log any blocked origin clearly.
function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true; // non-browser requests (curl, server-to-server)
  if (staticAllowedOrigins.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.sanity\.studio$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn('[CORS] Blocked request from origin:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health Check -- open this URL directly in your browser to confirm the
// backend is actually reachable: https://<your-backend>.onrender.com/health
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'English Platform Backend API is running',
    database:
      connectToDatabase && process.env.MONGODB_URI ? 'Configured' : 'Not Configured',
    sanity: sanityConfigOk ? 'Configured' : 'MISSING ENV VARS - check Render logs',
  });
});

// Start Server
async function startServer() {
  try {
    await connectToDatabase();
    console.log('MongoDB Connected');

    app.use('/api/auth', authRoutes);
    app.use('/api/tests', testRoutes);
    app.use('/api/sanity', sanityImportRoutes);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server');
    console.error(err);
    process.exit(1);
  }
}

startServer();