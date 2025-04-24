/**
 * Service for retrieving current season information based on configured dates.
 */

/**
 * Information about the current Fortnite season.
 */
export interface SeasonInfo {
  /** Name of the current season */
  name: string;
  /** ISO string of season start date */
  startDate: string;
  /** ISO string of season end date */
  endDate: string;
  /** Number of full days remaining until season end */
  daysRemaining: number;
  /** Hours remaining within the current day */
  hoursRemaining: number;
  /** Minutes remaining within the current hour */
  minutesRemaining: number;
  /** Seconds remaining within the current minute */
  secondsRemaining: number;
  /** Percentage of season elapsed (0-100) */
  percentComplete: number;
}

// Internal storage for initialized season dates
let seasonName: string;
let seasonStartDate: string;
let seasonEndDate: string;
let initialized = false;

/**
 * Initialize season info using environment variables.
 * Requires SEASON_START_DATE and SEASON_END_DATE (ISO strings).
 * Optional SEASON_NAME.
 */
export async function initializeSeasonInfo(): Promise<void> {
  const nameEnv = process.env.SEASON_NAME || '';
  const startEnv = process.env.SEASON_START_DATE;
  const endEnv = process.env.SEASON_END_DATE;
  if (!startEnv || !endEnv) {
    throw new Error('SEASON_START_DATE and SEASON_END_DATE environment variables are required');
  }
  seasonName = nameEnv;
  seasonStartDate = startEnv;
  seasonEndDate = endEnv;
  initialized = true;
}

/**
 * Get current season info. Must be initialized via initializeSeasonInfo().
 */
export function getSeasonInfo(): SeasonInfo {
  if (!initialized) {
    throw new Error('Season info not initialized');
  }
  const now = new Date();
  const start = new Date(seasonStartDate);
  const end = new Date(seasonEndDate);
  const msRemaining = end.getTime() - now.getTime();
  const positiveMs = Math.max(msRemaining, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerHour = 1000 * 60 * 60;
  const msPerMinute = 1000 * 60;
  // Breakdown remaining time into days, hours, minutes, seconds
  // Use full days (floor) for daysRemaining
  const days = Math.floor(positiveMs / msPerDay);
  const daysRemaining = days;
  let remainder = positiveMs - days * msPerDay;
  const hours = Math.floor(remainder / msPerHour);
  remainder -= hours * msPerHour;
  const minutes = Math.floor(remainder / msPerMinute);
  remainder -= minutes * msPerMinute;
  const seconds = Math.floor(remainder / 1000);
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  let percent = (elapsed / total) * 100;
  percent = Math.min(Math.max(percent, 0), 100);
  const percentComplete = parseFloat(percent.toFixed(2));
  return {
    name: seasonName,
    startDate: seasonStartDate,
    endDate: seasonEndDate,
    daysRemaining,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    percentComplete,
  };
}