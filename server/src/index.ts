import path from 'path';
import dotenv from 'dotenv';
// Load .env from project root (if exists)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Load .env from server root as fallback
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import playerRoutes from './routes/playerRoutes';
import seasonRoutes from './routes/seasonRoutes';
import { initializeSeasonInfo } from './services/seasonService';

// Confirm API key is loaded
console.log(`[server] FNAPI_KEY ${process.env.FNAPI_KEY ? 'loaded' : 'MISSING'}`);

const app = express();
app.use(cors());
app.use(express.json());

// API routes for managing players
app.use('/api/players', playerRoutes);
// API route for current season info
app.use('/api/season', seasonRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await initializeSeasonInfo();
    console.log('[server] Season info initialized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error('[server] Failed to initialize season info:', err.message || err);
    process.exit(1);
  }
})();