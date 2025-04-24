import { Router } from 'express';
import { listPlayers, createPlayer, deletePlayer } from '../controllers/playerController';

const router = Router();
router.get('/', listPlayers);
router.post('/', createPlayer);
router.delete('/:id', deletePlayer);

export default router;