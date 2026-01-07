import React, { useState, useEffect, useRef } from "react";
import challengesData from "../data/challengesData";
import CodeRunner from "../components/CodeRunner";
import {
  getScore,
  setScore,
  incrementScore,
  resetScore,
  getStreak,
  incrementStreak,
  resetStreak,
  addToLeaderboard,
  getLeaderboard,
  getInitialTimer,
  getXP,
  setXP,
  addXP,
  resetXP,
  getCategoryOptions,
  calculateXPToAdd
} from "../utils/challengeGameUtils";

// Executive Gray constants for styling
const theme = {
  primary: "#374151",
  secondary: "#9CA3AF",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#111827",
  success: "#059669",
  error: "#DC2626"
};

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChallengesPage() {
  // UI/game state
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(challengesData[0]);
  const [showSolution, setShowSolution] = useState(false);

  // Code/attempt/feedback
  const [userCode, setUserCode] = useState({});
  const [feedback, setFeedback] = useState({});
  const [attempted, setAttempted] = useState({});
  const [isCorrect, setIsCorrect] = useState({});

  // Score, streak, leaderboard, and XP
  const [score, setScoreState] = useState(getScore());
  const [streak, setStreakState] = useState(getStreak());
  const [xp, setXPState] = useState(getXP());
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [username, setUsername] = useState(() => (localStorage.getItem("challenge_user") || "").substring(0,32));

  // Timer
  const [timeLeft, setTimeLeft] = useState(getInitialTimer());
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState("All");
  const categoryOptions = getCategoryOptions(challengesData);

  // On challenge change: reset code, feedback, timer etc
  useEffect(() => {
    setShowSolution(false);
    setSelectedChallenge(filteredChallenges[selectedIdx] || filteredChallenges[0]);
    setTimeLeft(getInitialTimer());
    setTimerActive(true);
    setUserCode(prev => ({
      ...prev,
      [(filteredChallenges[selectedIdx] || filteredChallenges[0])?.id]: ""
    }));
    if (timerRef.current) clearInterval(timerRef.current);
    // Timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setShowSolution(true);
          resetStreak();
          setStreakState(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [selectedIdx, categoryFilter]);

  // Sync with localStorage for cross-tab
  useEffect(() => {
    const handler = () => {
      setScoreState(getScore());
      setStreakState(getStreak());
      setXPState(getXP());
      setLeaderboard(getLeaderboard());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Filtered list of challenges based on selected category
  const filteredChallenges =
    categoryFilter === "All"
      ? challengesData
      : challengesData.filter((ch) => ch.category === categoryFilter);

  // On evaluation
  const handleEvaluation = (details) => {
    const currCh = filteredChallenges[selectedIdx] || filteredChallenges[0];
    if (!currCh || !timerActive || timeLeft === 0) return;

    if (details.correct) {
      setShowSolution(false);
      const newScore = incrementScore(10);
      setScoreState(newScore);

      const newStreak = incrementStreak();
      setStreakState(newStreak);

      const xpAward = calculateXPToAdd(true, currCh); // pass=true
      const newXP = addXP(xpAward);
      setXPState(newXP);

      setIsCorrect(s => ({ ...s, [currCh.id]: true }));
      // Leaderboard (now with XP)
      if (username) {
        setLeaderboard(addToLeaderboard(username, newScore, newXP));
      }
      setTimerActive(false); // Stop timer
    } else {
      setShowSolution(true);
      setIsCorrect(s => ({ ...s, [currCh.id]: false }));
      resetStreak();
      setStreakState(0);
      setTimerActive(false);
    }
  };

  // Score/streak/XP reset all
  const handleResetProgress = () => {
    resetScore();
    resetStreak();
    resetXP();
    setScoreState(0);
    setStreakState(0);
    setXPState(0);
    setLeaderboard([]);
  };

  // Challenge selection
  const handleSelectChallenge = (i) => {
    setSelectedIdx(i);
  };

  // Username
  const handleUsernameChange = e => {
    const name = e.target.value.substring(0,32);
    setUsername(name);
    localStorage.setItem("challenge_user", name);
  };

  // Timer styling
  const timerColor =
    timeLeft === 0 ? theme.error :
    timeLeft <= 10 ? "#DC2626" :
    timeLeft <= 30 ? "#FFD326" :
    theme.primary;

  return (
    <div style={{ background: theme.background, minHeight: "100vh", padding: "2em 0" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 12px" }}>
        <h2 style={{ color: theme.primary, fontWeight: 800, fontSize: "2em", margin: "0 0 26px 0" }}>
          Coding Challenges
        </h2>
        {/* Score | Streak | XP | timer | name bar */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: 24, gap: 10
        }}>
          <span style={{
            background: "linear-gradient(to right, #37415112, #9CA3AF20)",
            border: "1px solid #9CA3AF77",
            color: theme.primary,
            borderRadius: 8, fontSize: 18,
            fontFamily: "monospace", padding: "5px 18px", fontWeight: 600
          }}>
            Score: <span style={{ fontWeight: 800 }}>{score}</span>
          </span>
          <span style={{
            padding: "4px 18px", marginLeft: 8, background: theme.surface,
            border: "1px solid #eee", borderRadius: 6,
            color: theme.secondary, fontFamily: "monospace"
          }}>
            Streak: <span style={{ fontWeight: 700, color: theme.success }}>{streak}</span>
          </span>
          <span style={{
            padding: "4px 18px", marginLeft: 8, background: theme.surface,
            border: "1px solid #eee", borderRadius: 6,
            color: theme.success, fontFamily: "monospace"
          }}>
            XP: <span style={{ fontWeight: 700 }}>{xp}</span>
          </span>
          {/* timer */}
          <span style={{
            color: timerColor,
            fontWeight: 800,
            fontFamily: "monospace",
            fontSize: 19,
            marginLeft: "auto",
            marginRight: 12,
            letterSpacing: 2
          }}>
            {timerActive ? `\u23f0 ${formatTimer(timeLeft)}` :
              (timeLeft === 0 ? "Time's up!" : "")}
          </span>
          {/* Leaderboard username input */}
          <input
            type="text"
            placeholder="Name for leaderboard"
            maxLength={32}
            value={username}
            onChange={handleUsernameChange}
            style={{
              padding: "5px 10px",
              border: "1px solid #BBB",
              borderRadius: 6,
              fontSize: 13,
              color: theme.primary,
              minWidth: 120
            }}
            disabled={!!leaderboard.find(entry => entry.username === username)}
          />
          <button
            style={{
              marginLeft: 7,
              background: theme.surface,
              color: theme.error,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              padding: "4px 12px"
            }}
            onClick={handleResetProgress}
          >
            Reset Progress
          </button>
        </div>
        {/* CATEGORY FILTER */}
        <div style={{ margin: "12px 0 16px 0" }}>
          <label style={{ fontWeight: 500, marginRight: 8 }}>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSelectedIdx(0);
            }}
            style={{
              background: "#F9FAFB",
              color: "#111827",
              border: "1px solid #9CA3AF",
              borderRadius: 5,
              padding: "4px 7px",
              fontSize: 15
            }}>
            {categoryOptions.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {/* Sidebar list + leaderboard */}
          <div style={{ flex: "0 0 220px" }}>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {filteredChallenges.map((challenge, i) => (
                <li
                  key={challenge.id}
                  style={{
                    background: selectedIdx === i ? theme.primary : theme.surface,
                    color: selectedIdx === i ? "#fff" : theme.primary,
                    borderRadius: 8,
                    boxShadow: "0 1px 7px #bbb2",
                    marginBottom: 13,
                    cursor: "pointer",
                    padding: "9px 13px",
                    fontWeight: 600,
                    transition: "all .14s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                  onClick={() => handleSelectChallenge(i)}
                >
                  <span>{challenge.title}</span>
                  <span style={{
                    color: theme.success,
                    background: "#ECFDF5",
                    borderRadius: 5,
                    fontWeight: 700,
                    fontSize: 12,
                    padding: "0px 8px",
                    marginLeft: 7
                  }}>
                    {challenge.xp} XP
                  </span>
                </li>
              ))}
              {/* Leaderboard */}
              <li style={{
                marginTop: 36,
                background: theme.surface,
                borderRadius: 12,
                boxShadow: "0 1px 8px #aaa5",
                padding: "10px 14px"
              }}>
                <div style={{ fontWeight: 700, color: theme.primary, fontSize: "1.05em", marginBottom: 2 }}>
                  🏆 Leaderboard
                </div>
                <ol style={{ paddingLeft: 18 }}>
                  {leaderboard.length === 0 ? (
                    <li style={{ color: theme.secondary, fontFamily: "monospace", fontSize: 13 }}>
                      No scores yet!
                    </li>
                  ) : (
                    leaderboard.map((entry, i) => (
                      <li
                        key={entry.username}
                        style={{
                          color: entry.username === username ? theme.success : theme.primary,
                          fontWeight: entry.username === username ? 700 : 500,
                          fontFamily: "monospace",
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 15
                        }}
                      >
                        <span style={{ minWidth: 20, display: "inline-block" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1) + "."}
                        </span>
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.username}
                        </span>
                        <span style={{ marginLeft: 8 }}>{entry.score}</span>
                        <span style={{
                          marginLeft: 8,
                          color: theme.success,
                          fontSize: 13,
                          border: "1px solid #ECFDF5",
                          background: "#ECFDF5",
                          borderRadius: 4,
                          padding: "0px 5px"
                        }}>
                          XP: {entry.totalXP || 0}
                        </span>
                      </li>
                    ))
                  )}
                </ol>
              </li>
            </ul>
          </div>
          {/* Main challenge runner */}
          <div style={{
            flex: "1 1 0 %",
            background: theme.surface,
            borderRadius: 12,
            boxShadow: "0 3px 22px #11111109",
            padding: "32px 24px",
            minWidth: 0
          }}>
            <h3 style={{ fontWeight: 800, color: theme.primary, fontSize: "1.18em", margin: "0 0 4px 0" }}>
              {selectedChallenge.title}
            </h3>
            <span
              style={{
                color: theme.secondary,
                background: "#E5E7EB",
                borderRadius: 5,
                fontWeight: 600,
                fontSize: 13,
                padding: "1px 8px",
                marginRight: 7
              }}
              title="Challenge category"
            >
              {selectedChallenge.category}
            </span>
            <span
              style={{
                color: theme.success,
                background: "#ECFDF5",
                borderRadius: 5,
                fontWeight: 600,
                fontSize: 13,
                padding: "1px 9px"
              }}
              title="XP for solving"
            >
              {selectedChallenge.xp} XP
            </span>
            <p style={{ color: theme.text, marginBottom: 10 }}>{selectedChallenge.description}</p>
            <textarea
              value={userCode[selectedChallenge.id] ?? ""}
              onChange={e =>
                setUserCode(prev => ({
                  ...prev,
                  [selectedChallenge.id]: e.target.value
                }))
              }
              placeholder={`Write your function: function ${selectedChallenge.funcName}(${selectedChallenge.testCases[0]?.input?.map((_,i)=>`arg${i+1}`).join(",") || ""}) { ... }`}
              disabled={isCorrect[selectedChallenge.id]}
              style={{
                width: "100%",
                minHeight: 90,
                background: theme.background,
                color: theme.text,
                border: `1px solid ${theme.secondary}`,
                borderRadius: "6px",
                padding: ".56em",
                fontFamily: "monospace",
                marginBottom: ".7em",
                fontSize: "1em"
              }}
              spellCheck={false}
              autoFocus={false}
            />
            <CodeRunner
              code={userCode[selectedChallenge.id] ?? ""}
              disabled={!timerActive || timeLeft === 0 || isCorrect[selectedChallenge.id]}
              challenge={selectedChallenge}
              showSolution={showSolution}
              onShowSolution={() => setShowSolution(true)}
              onSubmitEvaluation={handleEvaluation}
            />
            <button
              onClick={e => {
                e.preventDefault();
                if (!timerActive || timeLeft === 0 || isCorrect[selectedChallenge.id]) return;
                // Evaluation logic
                let details = { correct: false };
                try {
                  // eslint-disable-next-line no-new-func
                  const fullCode = `
                    ${userCode[selectedChallenge.id] || ""}
                    return typeof ${selectedChallenge.funcName} === "function" ? ${selectedChallenge.funcName} : null;
                  `;
                  const userFunc = new Function(fullCode)();
                  if (typeof userFunc !== "function") {
                    details = { correct: false };
                  } else {
                    const results = selectedChallenge.testCases.map(tc => {
                      let actual, pass;
                      try {
                        actual = userFunc(...tc.input);
                        pass = (typeof tc.output === "object" && tc.output !== null)
                          ? JSON.stringify(actual) === JSON.stringify(tc.output)
                          : actual === tc.output;
                      } catch (err) {
                        pass = false;
                      }
                      return { ...tc, actual, pass };
                    });
                    details = { correct: results.every(r => r.pass) };
                  }
                } catch {
                  details = { correct: false };
                }
                handleEvaluation(details);
              }}
              disabled={!timerActive || timeLeft === 0 || isCorrect[selectedChallenge.id]}
              style={{
                marginTop: 10,
                background: isCorrect[selectedChallenge.id] ? theme.success : theme.primary,
                color: theme.surface,
                border: "none",
                borderRadius: 6,
                padding: "0.48em 1.8em",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "1.08em",
                cursor: (!timerActive || timeLeft === 0 || isCorrect[selectedChallenge.id]) ? "not-allowed" : "pointer",
                opacity: (!timerActive || timeLeft === 0 || isCorrect[selectedChallenge.id]) ? 0.56 : 1
              }}
            >
              {isCorrect[selectedChallenge.id] ? "Submitted" : "Submit"}
            </button>
            {showSolution && (
              <div style={{ color: theme.error, marginTop: 16, fontWeight: 600 }}>
                {timeLeft === 0 ? "Time expired. Streak reset." : "Incorrect. Streak reset."}
                <pre style={{
                  background: "#F9FAFB",
                  border: `1px solid #e5e7eb`,
                  borderRadius: 6,
                  color: theme.secondary,
                  fontFamily: "monospace",
                  fontSize: ".97em",
                  marginTop: 8,
                  padding: "0.8em"
                }}>
                  {/* Solution can be shown here if desired */}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
