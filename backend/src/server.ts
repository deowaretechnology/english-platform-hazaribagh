import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import sanityImportRoutes from './controllers/sanityImportRoutes.js';
import { connectToDatabase } from './lib/db/mongodb.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://english-platform-hazaribagh.vercel.app',
      'https://english-platform-hazaribagh.sanity.studio',
    ],
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'English Platform Backend API is running',
    database:
      connectToDatabase && process.env.MONGODB_URI ? 'Configured' : 'Not Configured',
  });
});

// Start Server
async function startServer() {
  try {
    // Connect MongoDB first
    await connectToDatabase();

    console.log('✅ MongoDB Connected');

    // Register Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/tests', testRoutes);
    app.use('/api/sanity', sanityImportRoutes);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server');
    console.error(err);
    process.exit(1);
  }
}

startServer();