import React from 'react';
import './styles/ChallengeCard.css';
import { FaStopwatch, FaTrophy } from "react-icons/fa";

/**
 * PUBLIC_INTERFACE
 * ChallengeCard displays a gamified challenge summary for dashboard or full details.
 * @param {Object} props
 * @param {string} props.title - Challenge title.
 * @param {string|number} props.duration - Duration for challenge (minutes).
 * @param {number} props.xp - XP reward.
 * @param {Function} [props.onStart] - Handler for start button.
 * @param {boolean} [props.summaryMode] - If true, reduced details for summary panel.
 */
function ChallengeCard({ title = 'JavaScript Coding Sprint', duration = '5', xp = 100, onStart, summaryMode }) {
  // Only title, xp, duration, and button for summary mode
  return (
    <div className={`challenge-card${summaryMode ? ' challenge-card-summary' : ''}`}>
      <div className="challenge-card-content">
        <div className="challenge-card-header">
          <span className="challenge-card-title">{title}</span>
        </div>
        <div className="challenge-card-details">
          <span className="challenge-card-detail"><FaStopwatch className="challenge-icon" /> {duration} min</span>
          <span className="challenge-card-detail"><FaTrophy className="challenge-icon trophy" /> {xp} XP</span>
        </div>
        <button className="challenge-card-start-btn" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}

export default ChallengeCard;
