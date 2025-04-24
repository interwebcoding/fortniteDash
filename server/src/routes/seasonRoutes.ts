import { Router } from 'express';
import { getSeason } from '../controllers/seasonController';

const router = Router();
// GET /api/season
router.get('/', getSeason);

export default router;