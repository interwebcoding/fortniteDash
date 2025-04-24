import { RequestHandler } from 'express';
import { getSeasonInfo } from '../services/seasonService';

/**
 * GET /api/season
 * Returns information about the current Fortnite season (days remaining, percent complete, etc.)
 */
export const getSeason: RequestHandler = (_req, res) => {
  try {
    const info = getSeasonInfo();
    res.json(info);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get season info' });
  }
};