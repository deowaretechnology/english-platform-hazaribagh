import mongoose from 'mongoose';
import { User, TestAttempt } from './models.js';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let rawUri = process.env.MONGODB_URI || 'mongodb+srv://rajumesh8969457707_db_user:ePdBXRFWgJJg3bek@cluster1.qaiyax7.mongodb.net/englishplatform?retryWrites=true&w=majority';
  // Strip accidental angle brackets around password
  const mongoUri = rawUri.replace(/<([^>]+)>/g, '$1');

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      dbName: 'englishplatform',
    };

    const conn = await mongoose.connect(mongoUri, opts);
    isConnected = true;
    console.log(`Successfully connected to MongoDB Atlas database: ${conn.connection.name}`);

    // Ensure collections exist in MongoDB Atlas
    try {
      await User.createCollection();
      await TestAttempt.createCollection();
    } catch (e) {
      // Collections already exist or created concurrently
    }

    return conn.connection;
  } catch (error) {
    console.warn('MongoDB Atlas connection unavailable, proceeding in fallback mode:', error);
    return null;
  }
}
