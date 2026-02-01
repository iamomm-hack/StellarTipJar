import React from 'react';
import { calculateStreak, getStreakMessage, getStreakLevel } from '../utils/streaks';
import { FireIcon } from './Icons';
import './StreakBadge.css';

function StreakBadge({ transactions }) {
  const streak = calculateStreak(transactions);
  const message = getStreakMessage(streak);
  const level = getStreakLevel(streak);

  if (streak === 0) {
    return null; // Don't show badge if no streak
  }

  return (
    <div className={`streak-badge streak-${level}`}>
      <div className="streak-icon">
        <FireIcon size={20} color="currentColor" />
      </div>
      <div className="streak-info">
        <span className="streak-count">{streak}</span>
        <span className="streak-label">day streak</span>
      </div>
    </div>
  );
}

export default StreakBadge;
