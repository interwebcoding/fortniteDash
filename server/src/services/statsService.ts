import NodeCache from 'node-cache';
import { Client, Language } from 'fnapicom';
import { Stats, Platform } from '../models/player';

// Cache stats for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

// Init Fortnite API client
const fnClient = new Client({ apiKey: process.env.FNAPI_KEY, language: Language.English });

// Add request interceptors to log full external API calls (method, URL, headers, params)
(function setupLogging() {
  try {
    // Log basic requests
    fnClient.http.axios.interceptors.request.use((config) => {
      console.log('[fnapicom request]', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        params: config.params,
      });
      return config;
    });
    // Log rate-limited stats requests (if separate instance)
    fnClient.http.statsAxios.interceptors.request.use((config) => {
      console.log('[fnapicom stats request]', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        params: config.params,
      });
      return config;
    });
  } catch (e) {
    console.warn('[statsService] Failed to setup request logging', e);
  }
})();

// Map our platform to API accountType
const platformMap: Record<string, 'epic' | 'psn' | 'xbl'> = {
  pc: 'epic',
  psn: 'psn',
  xbox: 'xbl',
};

/**
 * Fetch player stats from API or cache
 */
/**
 * Fetch player stats from API or cache
 * @param username player name
 * @param platform optional platform (empty string for default)
 */
export async function getPlayerStats(username: string, platform: Platform): Promise<Stats> {
  const key = `${username}-${platform}`;
  const cached = cache.get<Stats>(key);
  if (cached) {
    return cached;
  }
  // Determine API accountType if platform specified
  const accountType = platformMap[platform];
  // Prepare request options (include only current season), omit accountType if not provided
  const options: any = { name: username };
  if (accountType) options.accountType = accountType;
  // Request only current season stats
  options.timeWindow = 'season';
  // Fetch battle royale stats via v2 endpoint
  const resp: any = await fnClient.brStats(options);
  const data: any = resp.data;
  const br = data.stats.all.overall;
  // Compute play time and avg match time
  const totalMinutes = br.minutesPlayed;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const playTime = `${hours}H ${minutes}M`;
  const avgMin = totalMinutes / (br.matches || 1);
  const avgMins = Math.floor(avgMin);
  const avgSecs = Math.floor((avgMin - avgMins) * 60);
  const avgMatchTime = `${avgMins}M ${avgSecs}S`;
  const stats: Stats = {
    chapter: '6',
    season: '2',
    level: data.battlePass.level,
    wins: br.wins,
    winRate: parseFloat((br.winRate).toFixed(2)),
    matches: br.matches,
    kd: parseFloat(br.kd.toFixed(2)),
    killsPerMatch: parseFloat(br.killsPerMatch.toFixed(2)),
    kills: br.kills,
    playTime,
    avgMatchTime,
  };
  cache.set(key, stats);
  return stats;
}