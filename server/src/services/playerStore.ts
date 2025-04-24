import fs from 'fs';
import path from 'path';
import { Player } from '../models/player';

const dataFile = path.resolve(__dirname, '../../data/players.json');

/**
 * Load players from storage
 */
function loadPlayers(): Player[] {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(raw) as Player[];
  } catch (err) {
    return [];
  }
}

/**
 * Save players to storage
 */
function savePlayers(players: Player[]): void {
  fs.writeFileSync(dataFile, JSON.stringify(players, null, 2), 'utf-8');
}

/**
 * Get all tracked players
 */
export function getPlayers(): Player[] {
  return loadPlayers();
}

/**
 * Add a new player
 */
export function addPlayer(player: Player): void {
  const players = loadPlayers();
  players.push(player);
  savePlayers(players);
}

/**
 * Remove a player by id
 */
export function removePlayer(id: string): void {
  const players = loadPlayers().filter(p => p.id !== id);
  savePlayers(players);
}