import React from 'react';
import './Milestones.css';

// Trophy icon
const TrophyIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12L12 4M12 7C10.34 7 9 8.34 9 10C9 11.31 9.84 12.42 11 12.83V17H13V12.83C14.16 12.42 15 11.31 15 10C15 8.34 13.66 7 12 7M12 9C12.55 9 13 9.45 13 10C13 10.55 12.55 11 12 11C11.45 11 11 10.55 11 10C11 9.45 11.45 9 12 9Z"/>
  </svg>
);

// Star icon
const StarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const MILESTONES = [
  { count: 10, name: 'First Steps', icon: '🌱', level: 'bronze' },
  { count: 25, name: 'Rising Star', icon: '⭐', level: 'bronze' },
  { count: 50, name: 'Supporter Magnet', icon: '🧲', level: 'silver' },
  { count: 100, name: 'Century Club', icon: '💯', level: 'silver' },
  { count: 250, name: 'Community Hero', icon: '🦸', level: 'gold' },
  { count: 500, name: 'Tip Legend', icon: '👑', level: 'gold' },
  { count: 1000, name: 'Stellar Master', icon: '🌟', level: 'platinum' },
];

function Milestones({ totalTips, tipCount }) {
  const achievedMilestones = MILESTONES.filter(m => tipCount >= m.count);
  const nextMilestone = MILESTONES.find(m => tipCount < m.count);
  const progress = nextMilestone 
    ? (tipCount / nextMilestone.count) * 100 
    : 100;

  return (
    <div className="milestones-container">
      <div className="milestones-header">
        <TrophyIcon size={24} />
        <h3>Tip Milestones</h3>
      </div>

      {/* Progress to next milestone */}
      {nextMilestone && (
        <div className="milestone-progress">
          <div className="progress-info">
            <span className="current-count">{tipCount} tips</span>
            <span className="next-milestone">
              {nextMilestone.icon} {nextMilestone.name} ({nextMilestone.count})
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-text">
            {nextMilestone.count - tipCount} more tips to next milestone!
          </p>
        </div>
      )}

      {/* Achieved Milestones */}
      <div className="achieved-milestones">
        <h4>Achievements Unlocked</h4>
        {achievedMilestones.length > 0 ? (
          <div className="milestone-badges">
            {achievedMilestones.map((milestone) => (
              <div 
                key={milestone.count} 
                className={`milestone-badge milestone-${milestone.level}`}
                title={`${milestone.name} - ${milestone.count} tips`}
              >
                <span className="badge-icon">{milestone.icon}</span>
                <span className="badge-name">{milestone.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-milestones">
            <StarIcon size={16} /> Receive 10 tips to unlock your first milestone!
          </p>
        )}
      </div>
    </div>
  );
}

export default Milestones;
