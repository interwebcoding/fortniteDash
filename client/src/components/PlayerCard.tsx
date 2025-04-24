import React from 'react';
import { PlayerWithStats } from '../types';

interface PlayerCardProps {
  player: PlayerWithStats;
  onRemove: (id: string) => void;
  /** Full days remaining in season */
  daysRemaining: number;
  /** Current theme mode */
  theme: 'light' | 'dark';
  /** Sort callback: pass metric key to sort by */
  /** Sort callback: pass metric key to sort by */
  onSort?: (key: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove, daysRemaining, theme, onSort = () => {} }) => {
  const { id, username, platform, stats } = player;
  // Calculate levels per day to reach level 200
  const levelsLeft = Math.max(200 - stats.level, 0);
  const perDay = daysRemaining > 0 ? levelsLeft / daysRemaining : 0;
  // Dynamic styles based on theme
  const cardStyle: React.CSSProperties = {
    border: `1px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    position: 'relative',
    // 30% transparent background for player cards
    backgroundColor: theme === 'dark'
      ? 'rgba(42, 42, 42, 0.7)'
      : 'rgba(255, 255, 255, 0.7)',
  };
  return (
    <div style={cardStyle}>
      <button
        onClick={() => onRemove(id)}
        aria-label="Remove player"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: '#ff4d4f',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.25rem 0.5rem',
          fontSize: '1rem',
          lineHeight: 1,
          cursor: 'pointer'
        }}
      >
        ×
      </button>
      <h2>
        {username}
        {platform && (
          <> ({platform.toUpperCase()})</>
        )}
      </h2>
      <p>
        <h3><strong
          style={{ cursor: 'pointer' }}
          onClick={() => onSort('level')}
        >Level:</strong> {stats.level}
        </h3>
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('wins')}
            >Wins:</strong> {stats.wins}
          </p>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('winRate')}
            >Win Rate:</strong> {stats.winRate}%
          </p>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('matches')}
            >Matches:</strong> {stats.matches}
          </p>
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('kd')}
            >K/D:</strong> {stats.kd}
          </p>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('killsPerMatch')}
            >Kills/Match:</strong> {stats.killsPerMatch}
          </p>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('kills')}
            >Total Kills:</strong> {stats.kills}
          </p>
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <p><strong>Play Time:</strong> {stats.playTime}</p>
          <p><strong>Avg Match Time:</strong> {stats.avgMatchTime}</p>
          <p>
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onSort('perDay')}
            >Levels/Day to 200:</strong> {perDay.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;