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

/**
 * Supported platform for lookup. Empty string for no specific platform.
 */
export type Platform = '' | 'pc' | 'xbox' | 'psn';

export interface PlayerWithStats {
  id: string;
  username: string;
  platform: Platform;
  stats: Stats;
}
// Information about the current Fortnite season
export interface SeasonInfo {
  name: string;
  startDate?: string;
  endDate: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  percentComplete?: number;
}