/**
 * Supported platform for lookup. Empty string means no specific platform (uses default API behavior).
 */
export type Platform = '' | 'pc' | 'xbox' | 'psn';

export interface Player {
  id: string;
  username: string;
  platform: Platform;
}

export interface Stats {
  chapter: string;
  season: string;
  level: number;
  wins: number;
  winRate: number;
  matches: number;
  kd: number;
  killsPerMatch: number;
  kills: number;
  playTime: string;
  avgMatchTime: string;
}

export interface PlayerWithStats extends Player {
  stats: Stats;
}