import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import AddPlayerForm from './components/AddPlayerForm';
import PlayerCard from './components/PlayerCard';
import { PlayerWithStats, Platform, SeasonInfo } from './types';

function App() {
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [seasonInfo, setSeasonInfo] = useState<SeasonInfo | null>(null);
  // Theme state: default to dark mode
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  // Easter egg: count theme toggles
  const [toggleCount, setToggleCount] = useState<number>(0);
  const [showEgg, setShowEgg] = useState<boolean>(false);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/players');
      if (!res.ok) {
        console.error('Failed to fetch players', res.status, res.statusText);
        setPlayers([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected response format for players', data);
        setPlayers([]);
        return;
      }
      setPlayers(data as PlayerWithStats[]);
    } catch (err) {
      console.error('Failed to fetch players', err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);
  // Fetch season info once
  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const res = await fetch('/api/season');
        if (!res.ok) {
          console.error('Failed to fetch season info', res.status, res.statusText);
          return;
        }
        const data = await res.json();
        setSeasonInfo(data as SeasonInfo);
      } catch (err) {
        console.error('Failed to fetch season info', err);
      }
    };
    fetchSeason();
  }, []);

  // Real-time clock to update countdown every second
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute dynamic countdown based on season end date
  let countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (seasonInfo) {
    const end = new Date(seasonInfo.endDate);
    const diff = Math.max(end.getTime() - now.getTime(), 0);
    const msPerDay = 1000 * 60 * 60 * 24;
    const msPerHour = 1000 * 60 * 60;
    const msPerMinute = 1000 * 60;
    const days = Math.floor(diff / msPerDay);
    let remainder = diff - days * msPerDay;
    const hours = Math.floor(remainder / msPerHour);
    remainder -= hours * msPerHour;
    const minutes = Math.floor(remainder / msPerMinute);
    remainder -= minutes * msPerMinute;
    const seconds = Math.floor(remainder / 1000);
    countdown = { days, hours, minutes, seconds };
  }
  // Full days remaining in season
  const daysRemaining = countdown.days;

  // Sorting state: metric key or null for no sort
  const [sortKey, setSortKey] = useState<string | null>(null);
  // Sort players by selected metric (descending)
  const sortedPlayers = useMemo(() => {
    if (!sortKey) return players;
    // clone array to avoid mutating state
    return [...players].sort((a, b) => {
      const getVal = (p: any) => {
        switch (sortKey) {
          case 'level': return p.stats.level;
          case 'wins': return p.stats.wins;
          case 'winRate': return p.stats.winRate;
          case 'matches': return p.stats.matches;
          case 'kd': return p.stats.kd;
          case 'killsPerMatch': return p.stats.killsPerMatch;
          case 'kills': return p.stats.kills;
          case 'perDay': return daysRemaining > 0 ? (200 - p.stats.level) / daysRemaining : 0;
          default: return 0;
        }
      };
      return getVal(b) - getVal(a);
    });
  }, [players, sortKey, daysRemaining]);

  const handleAdd = async (username: string, platform: Platform) => {
    setAddError(null);
    try {
      // Build payload: include platform only if selected
      const payload: Record<string, any> = { username };
      if (platform) payload.platform = platform;
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setAddError(data.error || 'Failed to add player');
        return;
      }
      setAddError(null);
      fetchPlayers();
    } catch (err) {
      console.error('Failed to add player', err);
      setAddError('Failed to add player');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await fetch(`/api/players/${id}`, { method: 'DELETE' });
      fetchPlayers();
    } catch (err) {
      console.error('Failed to remove player', err);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    setToggleCount(prevCount => {
      const nextCount = prevCount + 1;
      if (nextCount === 21) {
        setShowEgg(true);
      }
      return nextCount;
    });
  };
  // When egg unlocked, scroll to bottom
  useEffect(() => {
    if (showEgg) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, [showEgg]);
  // Container style: background image with translucent overlay via CSS background-color
  const containerStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundImage: 'url(/media/background.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
  };
  // Helper to pad numbers to two digits
  const pad2 = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className={`App ${theme}`} style={containerStyle}>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          background: theme === 'dark' ? '#333' : '#ddd',
          color: theme === 'dark' ? '#fff' : '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
      {/* Season header with progress bar and countdown styling */}
      {seasonInfo && (
        <div className="season-banner">
          <div className="season-banner-heading">
            {seasonInfo.name} is{' '}
            <span className="season-banner-highlight">
              {seasonInfo.percentComplete}%
            </span>{' '}
            complete. There are{' '}
            <span className="season-banner-highlight">
              {countdown.days}
            </span>{' '}
            days remaining.
          </div>
          <div className="season-progress-bar">
            <div
              className="season-progress-bar-fill"
              style={{ width: `${seasonInfo.percentComplete}%` }}
            />
          </div>
          <div className="season-countdown">
            <span className="cd-number">
              {pad2(countdown.days)}
            </span>
            <span className="cd-sep">:</span>
            <span className="cd-number">
              {pad2(countdown.hours)}
            </span>
            <span className="cd-sep">:</span>
            <span className="cd-number">
              {pad2(countdown.minutes)}
            </span>
            <span className="cd-sep">:</span>
            <span className="cd-number">
              {pad2(countdown.seconds)}
            </span>
          </div>
        </div>
      )}
      <h1>Fortnite Dashboard</h1>
      <AddPlayerForm onAdd={handleAdd} />
      {addError && <p style={{ color: 'red', marginBottom: '1rem' }}>{addError}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        sortedPlayers.map(p => (
          <PlayerCard
            key={p.id}
            player={p}
            onRemove={handleRemove}
            daysRemaining={daysRemaining}
            theme={theme}
            onSort={setSortKey}
          />
        ))
      )}
      <footer className="App-footer">
        <div>Creator Code: SatoshiFTW</div>
        {showEgg && (
          <a
            className="egg-button"
            href="https://youtu.be/dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click Me
          </a>
        )}
        <div>
          hosted by: <a href="https://www.interwebcoding.com" target="_blank" rel="noopener noreferrer">interwebcoding.com</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
