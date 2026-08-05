import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'English Platform Backend API' });
});

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});
