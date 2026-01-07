import React, { useState, useEffect, useRef } from 'react';
import challengesData from '../data/challengesData';
import '../styles/components.css';
import CodeRunner from '../components/CodeRunner.jsx';
import { loadState, saveState, clearState } from '../utils/challengeGameUtils';

// Timer duration in seconds (3 minutes)
const DEFAULT_TIMER_DURATION = 180;

// PUBLIC_INTERFACE
function ChallengesPage() {
  // State for current challenge index, timer, submitted, score, streak, etc.
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [timer, setTimer] = useState(DEFAULT_TIMER_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const timerRef = useRef();

  // Reset the timer to initial duration
  // PUBLIC_INTERFACE
  const resetTimer = () => {
    setTimer(DEFAULT_TIMER_DURATION);
  };

  // Timer countdown effect
  useEffect(() => {
    if (submitted) return;
    if (timer === 0) return;
    timerRef.current = setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, submitted]);

  // Load state from localStorage on mount
  useEffect(() => {
    const state = loadState();
    if (state) {
      setCurrentChallengeIdx(state.currentChallengeIdx || 0);
      setScore(state.score || 0);
      setStreak(state.streak || 0);
      setXp(state.xp || 0);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    saveState({
      currentChallengeIdx,
      score,
      streak,
      xp,
    });
  }, [currentChallengeIdx, score, streak, xp]);

  const currentChallenge = challengesData[currentChallengeIdx];

  const handleSubmit = (codeResult) => {
    setSubmitted(true);
    if (codeResult.correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setXp(xp + 10);
    } else {
      setStreak(0);
    }
  };

  const handleNextChallenge = () => {
    setCurrentChallengeIdx(curr => curr + 1);
    setTimer(DEFAULT_TIMER_DURATION);
    setSubmitted(false);
  };

  // UI for timer and reset button
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!currentChallenge) {
    return (
      <div className="container challenge-page">
        <h2>No more challenges!</h2>
        <div>Your final score: {score}</div>
        <div>Streak: {streak}</div>
        <div>XP: {xp}</div>
        <button onClick={() => clearState()}>Clear Progress</button>
      </div>
    );
  }

  return (
    <div className="container challenge-page">
      <h2>Challenge {currentChallengeIdx + 1}</h2>
      <div className="challenge-meta-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div className="timer" style={{
          background: '#374151', color: '#fff', borderRadius: 4, padding: '0.5em 1em',
          display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>Timer:</span>
          <span aria-live="polite" style={{ fontFamily: 'monospace', fontSize: 18 }}>{formatTime(timer)}</span>
          {/* Reset Timer Button */}
          <button
            onClick={resetTimer}
            style={{
              marginLeft: 10,
              padding: '0.25em 0.8em',
              background: '#9CA3AF',
              color: '#111827',
              border: 'none',
              borderRadius: 3,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
            title="Reset timer to 03:00. Does NOT affect score or streak."
            disabled={submitted || timer === DEFAULT_TIMER_DURATION}
            aria-label="Reset challenge timer"
          >
            Reset
          </button>
        </div>
        <div>Score: <b>{score}</b> | Streak: <b>{streak}</b> | XP: <b>{xp}</b></div>
      </div>
      <div className="challenge-content" style={{marginBottom: 24}}>
        <div className="challenge-description">{currentChallenge.description}</div>
      </div>
      <CodeRunner
        challenge={currentChallenge}
        submitted={submitted}
        setSubmitted={setSubmitted}
        onSubmit={handleSubmit}
        disabled={timer === 0 || submitted}
        timer={timer}
      />
      <div style={{marginTop: 24}}>
        <button
          onClick={handleNextChallenge}
          disabled={submitted === false}
          className="next-challenge-btn"
          style={{
            padding: '0.5em 1.5em',
            background: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            fontWeight: 600,
            cursor: submitted ? 'pointer' : 'not-allowed',
          }}
        >
          Next Challenge
        </button>
      </div>
    </div>
  );
}

export default ChallengesPage;
