import React, { useState, useEffect } from "react";
import challengesData from "../data/challengesData";
import "../styles/components.css";
import "../styles/theme.css";

const STORAGE_KEY = "challengeAttemptsV2";

// PUBLIC_INTERFACE
function getStoredAttempts() {
  // Loads user attempts from localStorage for persistence
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// PUBLIC_INTERFACE
function saveAttempt(challengeId, userCode, isCorrect) {
  // Stores user attempts in localStorage (per challenge)
  const attempts = getStoredAttempts();
  attempts[challengeId] = {
    userCode,
    isCorrect,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

// Simple frontend code validation
// PUBLIC_INTERFACE
function validateCodeAnswer({ userCode, expectedOutput, keywords }) {
  const trimmedUser = userCode.trim().replace(/\s+/g, " ").toLowerCase();
  const trimmedExpected = expectedOutput.trim().replace(/\s+/g, " ").toLowerCase();

  // Accepts user answer if it has expectedOutput or all keywords present (super simple)
  if (trimmedUser.includes(trimmedExpected)) {
    return true;
  }
  if (Array.isArray(keywords) && keywords.length > 0) {
    let allKeywordsPresent = keywords.every((kw) =>
      trimmedUser.includes(kw.toLowerCase())
    );
    if (allKeywordsPresent) return true;
  }
  return false;
}

// PUBLIC_INTERFACE
const categoryList = [
  ...new Set(challengesData.map((c) => c.category)),
];

const theme = {
  primary: "#374151",
  secondary: "#9CA3AF",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#111827",
  success: "#059669",
  error: "#DC2626",
};

const codeInputStyle = {
  width: "100%",
  minHeight: "75px",
  background: theme.background,
  color: theme.text,
  border: `1px solid ${theme.secondary}`,
  borderRadius: "6px",
  padding: "0.5em",
  fontFamily: "monospace",
  marginBottom: "0.5em",
  fontSize: "1em",
};

const badgeStyle = {
  padding: "0.25em 0.75em",
  borderRadius: "100px",
  background: theme.primary,
  color: theme.surface,
  fontSize: "0.8em",
  fontWeight: 600,
  marginLeft: "0.5em",
  marginBottom: "3px",
  display: "inline-block",
};

const multiBoxStyle = {
  background: theme.surface,
  boxShadow: "0 1px 8px 0 #37415115",
  borderRadius: 8,
  marginBottom: "1.5em",
  padding: "1.5em 1.2em",
};

export default function ChallengesPage() {
  // Category filter state
  const [activeCategory, setActiveCategory] = useState("All");

  // User code answers per challenge: { [id]: userCode }
  const [userCode, setUserCode] = useState({});

  // Challenge attempts state: { [id]: { userCode, isCorrect, timestamp } }
  const [attempts, setAttempts] = useState({});

  // Flash feedback per challenge
  const [feedback, setFeedback] = useState({});

  // XP state
  const [xp, setXP] = useState(0);

  // Load attempts from localStorage at component mount
  useEffect(() => {
    const atpts = getStoredAttempts();
    setAttempts(atpts);
    // Calculate total earned XP
    let earnedXP = 0;
    challengesData.forEach((ch) => {
      if (atpts[ch.id]?.isCorrect) earnedXP += ch.xp;
    });
    setXP(earnedXP);
  }, []);

  // Handler for typing code answer
  const handleCodeChange = (id, value) => {
    setUserCode((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = (challenge) => (e) => {
    e.preventDefault();
    const codeAns = userCode[challenge.id] || "";
    const result = validateCodeAnswer({
      userCode: codeAns,
      expectedOutput: challenge.expectedOutput,
      keywords: challenge.keywords,
    });
    setFeedback((prev) => ({
      ...prev,
      [challenge.id]: result ? "Correct! XP earned." : "Try again.",
    }));
    saveAttempt(challenge.id, codeAns, result);
    setAttempts((prev) => ({
      ...prev,
      [challenge.id]: {
        userCode: codeAns,
        isCorrect: result,
        timestamp: new Date().toISOString(),
      },
    }));
    // Update XP if correct for first time
    if (result && !(attempts[challenge.id] && attempts[challenge.id].isCorrect)) {
      setXP((prevXP) => prevXP + challenge.xp);
    }
  };

  const filteredChallenges =
    activeCategory === "All"
      ? challengesData
      : challengesData.filter((ch) => ch.category === activeCategory);

  return (
    <main style={{ background: theme.background, minHeight: "100vh", padding: "1.6em 6vw" }}>
      <h1 style={{ color: theme.primary, fontWeight: 800, fontSize: "2.1em" }}>
        Coding Challenges
        <span style={badgeStyle}>XP: {xp}</span>
      </h1>
      <div style={{ margin: "1.2em 0 2em 0" }}>
        <strong>Category:</strong>
        <button
          style={{
            ...badgeStyle,
            background: activeCategory === "All" ? theme.success : theme.secondary,
            marginLeft: "1em",
            cursor: "pointer",
          }}
          onClick={() => setActiveCategory("All")}
        >
          All
        </button>
        {categoryList.map((cat) => (
          <button
            key={cat}
            style={{
              ...badgeStyle,
              background: activeCategory === cat ? theme.success : theme.secondary,
              color: activeCategory === cat ? theme.surface : theme.primary,
              marginLeft: "0.55em",
              cursor: "pointer",
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {filteredChallenges.length === 0 ? (
        <div>No coding challenges in this category yet.</div>
      ) : (
        filteredChallenges.map((challenge) => {
          const attempted = !!attempts[challenge.id];
          const isCorrect = attempted && attempts[challenge.id].isCorrect;
          return (
            <section key={challenge.id} style={multiBoxStyle}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "1.01em",
                    color: theme.primary,
                    flex: 1,
                  }}
                  dangerouslySetInnerHTML={{ __html: challenge.prompt }}
                />
                <span style={{
                  ...badgeStyle,
                  background: isCorrect ? theme.success : theme.error,
                  marginLeft: "24px"
                }}>
                  {isCorrect ? "Completed" : attempted ? "In Progress" : "Unattempted"}
                </span>
                <span style={{ ...badgeStyle, background: theme.secondary, marginLeft: "1em" }}>
                  +{challenge.xp} XP
                </span>
              </div>
              <form onSubmit={handleSubmit(challenge)} style={{ marginTop: "1em" }}>
                {challenge.starterCode && (
                  <div style={{
                    background: "#F3F4F6",
                    border: `1px solid ${theme.secondary}`,
                    borderRadius: "6px",
                    padding: "0.75em",
                    marginBottom: "0.6em",
                    fontFamily: "monospace",
                    fontSize: "0.96em",
                  }}>
                    <div style={{ color: theme.secondary, marginBottom: 2 }}>
                      <strong>Starter code:</strong>
                    </div>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{challenge.starterCode}</pre>
                  </div>
                )}
                <textarea
                  value={userCode[challenge.id] ?? (attempts[challenge.id]?.userCode || "")}
                  onChange={(e) => handleCodeChange(challenge.id, e.target.value)}
                  style={codeInputStyle}
                  placeholder="Type your code answer here..."
                  disabled={isCorrect}
                  spellCheck="false"
                  autoFocus={false}
                />
                <button
                  type="submit"
                  disabled={isCorrect}
                  style={{
                    background: isCorrect ? theme.success : theme.primary,
                    color: theme.surface,
                    border: "none",
                    borderRadius: "5px",
                    padding: "0.5em 1.5em",
                    cursor: isCorrect ? "default" : "pointer",
                    fontWeight: 600,
                    letterSpacing: ".03em",
                  }}
                >
                  {isCorrect ? "Submitted" : "Submit"}
                </button>
                {feedback[challenge.id] && (
                  <span
                    style={{
                      marginLeft: "1em",
                      color: feedback[challenge.id].startsWith("Correct")
                        ? theme.success
                        : theme.error,
                      fontWeight: 600,
                    }}
                  >
                    {feedback[challenge.id]}
                  </span>
                )}
                {isCorrect && (
                  <div style={{ color: theme.success, marginTop: "0.75em" }}>
                    ✔️ Correct! You earned {challenge.xp} XP.
                  </div>
                )}
              </form>
              {attempted && !isCorrect && attempts[challenge.id].userCode && (
                <div style={{ color: theme.error, marginTop: "0.6em" }}>
                  Last attempt: <code>{attempts[challenge.id].userCode}</code>
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}
