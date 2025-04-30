import React from 'react';
import { PlayerWithStats } from '../types';
import './PlayerCard.css';

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
  return (
    <div className={`player-card ${theme}`}>
      <button
        className="remove-button"
        onClick={() => onRemove(id)}
        aria-label="Remove player"
      >
        ×
      </button>
      <h2 className="player-name">
        {username}
        {platform && ` (${platform.toUpperCase()})`}
      </h2>
      <div className="player-level">
        <span
          className="level-label"
          onClick={() => onSort('level')}
        >
          LEVEL
        </span>
        <span className="level-value">{stats.level}</span>
      </div>
      <div className="stat-row row-1">
        <div className="row-icon" onClick={() => onSort('wins')}>
          <i className="fas fa-trophy"></i>
        </div>
        <div className="stat-items">
          <div className="stat-item" onClick={() => onSort('wins')}>
            <div className="stat-value">{stats.wins}</div>
            <div className="stat-label">WINS</div>
          </div>
          <div className="stat-item" onClick={() => onSort('winRate')}>
            <div className="stat-value">{stats.winRate}%</div>
            <div className="stat-label">WIN RATE</div>
          </div>
          <div className="stat-item" onClick={() => onSort('matches')}>
            <div className="stat-value">{stats.matches}</div>
            <div className="stat-label">MATCHES</div>
          </div>
        </div>
      </div>
      <div className="stat-row row-2">
        <div className="row-icon" onClick={() => onSort('kd')}>
          <i className="fas fa-crosshairs"></i>
        </div>
        <div className="stat-items">
          <div className="stat-item" onClick={() => onSort('kd')}>
            <div className="stat-value">{stats.kd.toFixed(2)}</div>
            <div className="stat-label">K/D</div>
          </div>
          <div className="stat-item" onClick={() => onSort('killsPerMatch')}>
            <div className="stat-value">{stats.killsPerMatch.toFixed(1)}</div>
            <div className="stat-label">KILLS/MATCH</div>
          </div>
          <div className="stat-item" onClick={() => onSort('kills')}>
            <div className="stat-value">{stats.kills}</div>
            <div className="stat-label">KILLS</div>
          </div>
        </div>
      </div>
      <div className="stat-row row-3">
        <div className="row-icon">
          <i className="fas fa-stopwatch"></i>
        </div>
        <div className="stat-items">
          <div className="stat-item">
            <div className="stat-value">{stats.playTime}</div>
            <div className="stat-label">PLAY TIME</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.avgMatchTime}</div>
            <div className="stat-label">AVG MATCH TIME</div>
          </div>
          <div className="stat-item" onClick={() => onSort('perDay')}>
            <div className="stat-value">{perDay.toFixed(2)}</div>
            <div className="stat-label">LVLS/DAY</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;