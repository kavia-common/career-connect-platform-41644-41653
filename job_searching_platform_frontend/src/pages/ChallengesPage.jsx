import React, { useState, useEffect } from "react";
import challengesData from "../data/challengesData";
import "../styles/components.css";
import "../styles/theme.css";
import CodeRunner from "../components/CodeRunner";

const STORAGE_KEY = "challengeAttemptsV3";

// PUBLIC_INTERFACE
function getStoredAttempts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// PUBLIC_INTERFACE
function saveAttempt(challengeId, userCode, isCorrect) {
  const attempts = getStoredAttempts();
  attempts[challengeId] = {
    userCode,
    isCorrect,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
}

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

const multiBoxStyle = {
  background: theme.surface,
  boxShadow: "0 1px 8px 0 #37415115",
  borderRadius: 8,
  marginBottom: "1.5em",
  padding: "1.5em 1.2em",
};

function runUserFunction(userCode, funcName, testCases) {
  // Evaluates user code in an isolated Function context for all test cases
  // Returns {pass: boolean, results: Array<{expected, actual, pass}>}
  try {
    // eslint-disable-next-line no-new-func
    const fullCode = `
      ${userCode}
      return typeof ${funcName} === "function" ? ${funcName} : null;
    `;
    const userFunc = new Function(fullCode)();
    if (typeof userFunc !== "function") {
      return { pass: false, results: testCases.map(tc => ({ ...tc, actual: undefined, pass: false, reason: "Function not found" })) };
    }
    const results = testCases.map(tc => {
      let actual, pass;
      try {
        actual = userFunc(...tc.input);
        // Use deep equality for primitive values, and special handling for objects
        pass = (typeof tc.output === "object" && tc.output !== null)
          ? JSON.stringify(actual) === JSON.stringify(tc.output)
          : actual === tc.output;
      } catch (e) {
        return { ...tc, actual: undefined, pass: false, reason: e.message };
      }
      return { ...tc, actual, pass };
    });
    return { pass: results.every(r => r.pass), results };
  } catch (err) {
    return { pass: false, results: testCases.map(tc => ({ ...tc, actual: undefined, pass: false, reason: err.message })) };
  }
}

export default function ChallengesPage() {
  // User code answers per challenge: { [id]: userCode }
  const [userCode, setUserCode] = useState({});
  // Challenge attempts state: { [id]: { userCode, isCorrect, timestamp } }
  const [attempts, setAttempts] = useState({});
  // Feedback/results per challenge
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    setAttempts(getStoredAttempts());
  }, []);

  const handleCodeChange = (id, value) => {
    setUserCode((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Reset feedback on typing
    setFeedback((prev) => ({
      ...prev,
      [id]: undefined,
    }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = (challenge) => (e) => {
    e.preventDefault();
    const codeAns = userCode[challenge.id] || "";
    // Evaluate function for all test cases
    const { pass, results } = runUserFunction(codeAns, challenge.funcName, challenge.testCases);
    setFeedback((prev) => ({
      ...prev,
      [challenge.id]: { pass, results },
    }));
    saveAttempt(challenge.id, codeAns, pass);
    setAttempts((prev) => ({
      ...prev,
      [challenge.id]: {
        userCode: codeAns,
        isCorrect: pass,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  return (
    <main style={{ background: theme.background, minHeight: "100vh", padding: "1.6em 6vw" }}>
      <h1 style={{ color: theme.primary, fontWeight: 800, fontSize: "2.1em" }}>
        Gamified Coding Challenges
      </h1>
      <div style={{ margin: "1.2em 0 2em 0" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "end", flexWrap: "wrap" }}>
          {/* Category and XP removed as per new schema */}
        </div>
      </div>
      {challengesData.length === 0 ? (
        <div>No coding challenges provided.</div>
      ) : (
        challengesData.map((challenge) => {
          const attempted = !!attempts[challenge.id];
          const isCorrect = attempted && attempts[challenge.id].isCorrect;
          const fb = feedback[challenge.id];
          return (
            <section key={challenge.id} style={multiBoxStyle}>
              <h2 style={{
                color: theme.primary,
                fontSize: "1.13em",
                fontWeight: 700,
                margin: 0,
                marginBottom: 5,
              }}>{challenge.title || challenge.funcName}</h2>
              <div style={{ color: theme.text, marginBottom: 8 }}>
                {challenge.description}
              </div>
              <form onSubmit={handleSubmit(challenge)} style={{ marginTop: "1em" }}>
                <textarea
                  value={userCode[challenge.id] ?? (attempts[challenge.id]?.userCode || "")}
                  onChange={(e) => handleCodeChange(challenge.id, e.target.value)}
                  style={codeInputStyle}
                  placeholder={`Write your function: function ${challenge.funcName}(${challenge.testCases[0]?.input?.map((_,i)=>`arg${i+1}`).join(",") || ""}) { ... }`}
                  disabled={isCorrect}
                  spellCheck="false"
                  autoFocus={false}
                />
                <CodeRunner
                  code={userCode[challenge.id] ?? (attempts[challenge.id]?.userCode || "")}
                  disabled={isCorrect}
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
                    marginTop: 12,
                  }}
                >
                  {isCorrect ? "Submitted" : "Submit"}
                </button>
                {fb && (
                  <span
                    style={{
                      marginLeft: "1em",
                      color: fb.pass ? theme.success : theme.error,
                      fontWeight: 600,
                    }}
                  >
                    {fb.pass
                      ? "All tests passed!"
                      : "Some test cases failed (see below)."}
                  </span>
                )}
                {isCorrect && (
                  <div style={{ color: theme.success, marginTop: "0.75em" }}>
                    ✔️ Correct!
                  </div>
                )}
              </form>
              {/* Per-test-case feedback */}
              {(fb && fb.results.length > 0) && (
                <div style={{
                  marginTop: 16,
                  background: "#F3F4F6",
                  border: `1px solid ${theme.secondary}`,
                  borderRadius: "6px",
                  padding: "0.75em",
                  fontFamily: "monospace",
                  fontSize: "0.99em",
                }}>
                  <div style={{ fontWeight: 500, color: theme.primary, marginBottom: 6 }}>
                    Test Cases:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {fb.results.map((tc, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, color: tc.pass ? theme.success : theme.error }}>
                          [{tc.pass ? "✓" : "✗"}]
                        </span>{" "}
                        <span>
                          <strong>Input:</strong> {JSON.stringify(tc.input)}
                          {" | "}
                          <strong>Expected:</strong> {JSON.stringify(tc.output)}
                          {" | "}
                          <strong>Actual:</strong> {JSON.stringify(tc.actual)}
                          {tc.reason && (
                            <span style={{ color: theme.error }}> ({tc.reason})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
