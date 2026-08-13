import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import sanityImportRoutes from './controllers/sanityImportRoutes.js';
import { connectToDatabase } from './lib/db/mongodb.js';
import { backendSanityClient } from './lib/sanity/sanity.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://english-platform-hazaribagh.vercel.app',
      'https://english-platform-hazaribagh.sanity.studio',
    ],
    credentials: true,
  }),
);

app.use(express.json());

// =========================
// Basic Health Check
// =========================

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'English Platform Backend API is running',
    database: process.env.MONGODB_URI
      ? 'Configured'
      : 'Not Configured',
  });
});

// =========================
// Sanity Health Check
// =========================

app.get('/health/sanity', async (_req, res) => {
  try {
    const result = await backendSanityClient.fetch(
      `{
        "testCount": count(*[_type == "test"]),
        "courseCount": count(*[_type == "course"]),
        "noteCount": count(*[_type == "note"]),
        "faqCount": count(*[_type in ["faq", "faqs"]]),
        "sampleTest": *[_type == "test"][0]{
          _id,
          title,
          classLevel,
          status
        }
      }`,
    );

    res.status(200).json({
      success: true,
      message: 'Sanity connection working',
      sanity: result,
    });
  } catch (error) {
    console.error('❌ Sanity health check failed:', error);

    res.status(500).json({
      success: false,
      message: 'Sanity connection failed',
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});

// =========================
// Start Server
// =========================

async function startServer() {
  try {
    // Connect MongoDB first
    await connectToDatabase();

    console.log('✅ MongoDB Connected');

    // =========================
    // API Routes
    // =========================

    app.use('/api/auth', authRoutes);
    app.use('/api/tests', testRoutes);
    app.use('/api/sanity', sanityImportRoutes);

    // =========================
    // Start HTTP Server
    // =========================

    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `🚀 Backend API running on port ${PORT}`,
      );
    });
  } catch (err) {
    console.error('❌ Failed to start server');
    console.error(err);
    process.exit(1);
  }
}

startServer();