import React from 'react';
import { PlayerWithStats } from '../types';

interface PlayerCardProps {
  player: PlayerWithStats;
  onRemove: (id: string) => void;
  /** Full days remaining in season */
  daysRemaining: number;
  /** Current theme mode */
  theme: 'light' | 'dark';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove, daysRemaining, theme }) => {
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
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
  };
  return (
    <div style={cardStyle}>
      <button
        onClick={() => onRemove(id)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
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
      <p>Level: {stats.level}</p>
      <p><strong>Levels/Day to 200:</strong> {perDay.toFixed(2)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <p><strong>Wins:</strong> {stats.wins}</p>
          <p><strong>Win Rate:</strong> {stats.winRate}%</p>
          <p><strong>Matches:</strong> {stats.matches}</p>
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <p><strong>K/D:</strong> {stats.kd}</p>
          <p><strong>Kills/Match:</strong> {stats.killsPerMatch}</p>
          <p><strong>Total Kills:</strong> {stats.kills}</p>
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <p><strong>Play Time:</strong> {stats.playTime}</p>
          <p><strong>Avg Match Time:</strong> {stats.avgMatchTime}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;