import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

async function startServer() {
  // Dynamically import routes and db connection after dotenv.config() has populated process.env
  const { connectToDatabase } = await import('./backend/src/lib/db/mongodb.js');
  await connectToDatabase();

  const { default: authRoutes } = await import('./backend/src/routes/authRoutes.js');
  const { default: testRoutes } = await import('./backend/src/routes/testRoutes.js');

  app.use('/api/auth', authRoutes);
  app.use('/api/tests', testRoutes);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
