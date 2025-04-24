import { Request, Response, NextFunction, RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getPlayers, addPlayer, removePlayer } from '../services/playerStore';
import { getPlayerStats } from '../services/statsService';
import { Player, PlayerWithStats, Platform } from '../models/player';

// GET /api/players
export const listPlayers: RequestHandler = async (req, res) => {
  try {
    const players = getPlayers();
    const withStats: PlayerWithStats[] = await Promise.all(
      players.map(async p => ({ ...p, stats: await getPlayerStats(p.username, p.platform) }))
    );
    res.json(withStats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
};

// POST /api/players
export const createPlayer: RequestHandler = async (req, res) => {
  const { username, platform } = req.body;
  if (!username) {
    res.status(400).json({ error: 'username is required' });
    return;
  }
  // Validate platform if provided
  const plat = platform as string | undefined;
  if (plat && !['pc', 'xbox', 'psn'].includes(plat)) {
    res.status(400).json({ error: 'platform must be pc, xbox, psn, or blank' });
    return;
  }
  // Validate player exists via Fortnite API
  try {
    // Validate player exists via Fortnite API (use Platform type cast)
    await getPlayerStats(username, (plat || '') as Platform);
  } catch (err) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  const id = uuidv4();
  // Persist blank platform as empty string
  const newPlayer: Player = { id, username, platform: (plat || '') as Platform };
  try {
    addPlayer(newPlayer);
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add player' });
  }
};

// DELETE /api/players/:id
export const deletePlayer: RequestHandler = (req, res) => {
  const { id } = req.params;
  try {
    removePlayer(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove player' });
  }
};