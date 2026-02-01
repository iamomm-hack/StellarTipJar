import React, { useState, useEffect } from 'react';
import './TipGoals.css';

// Goal icon
const GoalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

// Edit icon
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

// Celebration icon
const CelebrationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z"/>
  </svg>
);

function TipGoals({ totalTips }) {
  const [goalAmount, setGoalAmount] = useState(() => {
    const saved = localStorage.getItem('tipGoal');
    return saved ? parseFloat(saved) : 100;
  });
  const [goalTitle, setGoalTitle] = useState(() => {
    const saved = localStorage.getItem('tipGoalTitle');
    return saved || 'Support Goal';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState(goalAmount);
  const [tempTitle, setTempTitle] = useState(goalTitle);

  const progress = Math.min((totalTips / goalAmount) * 100, 100);
  const isComplete = totalTips >= goalAmount;

  useEffect(() => {
    localStorage.setItem('tipGoal', goalAmount.toString());
    localStorage.setItem('tipGoalTitle', goalTitle);
  }, [goalAmount, goalTitle]);

  const handleSave = () => {
    if (tempGoal > 0) {
      setGoalAmount(tempGoal);
      setGoalTitle(tempTitle || 'Support Goal');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempGoal(goalAmount);
    setTempTitle(goalTitle);
    setIsEditing(false);
  };

  return (
    <div className={`tip-goals ${isComplete ? 'complete' : ''}`}>
      <div className="goals-header">
        <div className="goals-title-row">
          <GoalIcon />
          <h3 className="goals-title">{goalTitle}</h3>
          {!isEditing && (
            <button className="btn-edit-goal" onClick={() => setIsEditing(true)}>
              <EditIcon />
            </button>
          )}
        </div>
        <p className="goals-subtitle">
          {isComplete ? 'Goal Reached!' : `${progress.toFixed(0)}% complete`}
        </p>
      </div>

      {isEditing ? (
        <div className="goals-edit-form">
          <div className="edit-row">
            <label>Title</label>
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              placeholder="e.g., Help me reach..."
            />
          </div>
          <div className="edit-row">
            <label>Goal (XLM)</label>
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(parseFloat(e.target.value) || 0)}
              min="1"
              step="10"
            />
          </div>
          <div className="edit-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="goals-progress-container">
            <div className="goals-progress-bar">
              <div 
                className="goals-progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            {isComplete && (
              <div className="goals-celebration">
                <CelebrationIcon />
              </div>
            )}
          </div>

          <div className="goals-stats">
            <div className="goals-current">
              <span className="stat-value">{totalTips.toFixed(2)}</span>
              <span className="stat-label">XLM raised</span>
            </div>
            <div className="goals-target">
              <span className="stat-value">{goalAmount.toFixed(0)}</span>
              <span className="stat-label">XLM goal</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TipGoals;
