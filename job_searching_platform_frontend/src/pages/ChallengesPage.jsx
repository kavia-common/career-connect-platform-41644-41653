import React, { useEffect, useMemo, useState } from "react";
import { challenges } from "../data/challengesData";

/**
 * LocalStorage key for challenges progress + XP.
 * Kept internal to this page to avoid prematurely committing to a global store API.
 */
const STORAGE_KEY = "cc_challenges_progress_v1";

/**
 * Normalize strings for answer matching.
 * - case-insensitive
 * - trims
 * - collapses whitespace
 */
function normalizeAnswer(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function safeLoadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { totalXp: 0, completedById: {} };
    }
    const parsed = JSON.parse(raw);
    const totalXp = Number(parsed?.totalXp ?? 0) || 0;
    const completedById =
      parsed?.completedById && typeof parsed.completedById === "object"
        ? parsed.completedById
        : {};
    return { totalXp, completedById };
  } catch {
    return { totalXp: 0, completedById: {} };
  }
}

function safeSaveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // If storage fails (private mode, quota), we still allow the session flow to work.
  }
}

/**
 * PUBLIC_INTERFACE
 * Gamified Challenges page: list challenges and allow attempts; award XP on completion.
 *
 * Current behavior:
 * - A challenge is "completed" only if all answers match (case-insensitive, trimmed).
 * - Completing a challenge awards its XP exactly once.
 * - Progress and total XP persist via localStorage.
 * - Category filter controls which challenges are shown (attempt flow unaffected).
 */
export default function ChallengesPage() {
  const [progress, setProgress] = useState(() => safeLoadProgress());

  // Browsing/filtering state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Attempt UI state
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [answersByIndex, setAnswersByIndex] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const completedById = progress.completedById || {};

  useEffect(() => {
    safeSaveProgress(progress);
  }, [progress]);

  const allCategories = useMemo(() => {
    /**
     * Dropdown order requirement:
     * - "All" first
     * - Then common categories: React, JavaScript, Python (if present)
     * - Then remaining categories A–Z
     *
     * We derive from `challenges` and keep resilient to dataset changes.
     */
    const derived = Array.from(
      new Set(challenges.map((c) => c.skill).filter(Boolean))
    );

    const PRIORITY = ["All", "React", "JavaScript", "Python"];
    const prioritySet = new Set(PRIORITY);

    const rest = derived
      .filter((c) => !prioritySet.has(c))
      .sort((a, b) => a.localeCompare(b));

    // Include only categories that exist in data, but always keep "All" first.
    const prioritized = PRIORITY.filter(
      (c) => c === "All" || derived.includes(c)
    );

    return [...prioritized, ...rest];
  }, []);

  // Keep selected category valid if dataset changes.
  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory("All");
      return;
    }
    if (selectedCategory !== "All" && allCategories.length > 0) {
      const allowed = new Set(allCategories);
      if (!allowed.has(selectedCategory)) setSelectedCategory("All");
    }
  }, [allCategories, selectedCategory]);

  const filteredChallenges = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return challenges;
    return challenges.filter((c) => c.skill === selectedCategory);
  }, [selectedCategory]);

  const activeChallenge = useMemo(() => {
    if (activeChallengeId == null) return null;
    // IMPORTANT: use full dataset (not filtered) so an in-progress attempt remains valid.
    return challenges.find((c) => c.id === activeChallengeId) ?? null;
  }, [activeChallengeId]);

  function startAttempt(challengeId) {
    setActiveChallengeId(challengeId);
    setAnswersByIndex({});
    setSubmitted(false);
  }

  function resetAttempt() {
    setActiveChallengeId(null);
    setAnswersByIndex({});
    setSubmitted(false);
  }

  function onChangeAnswer(idx, value) {
    setAnswersByIndex((prev) => ({ ...prev, [idx]: value }));
  }

  function gradeAttempt(challenge) {
    const results = challenge.questions.map((q, idx) => {
      const user = normalizeAnswer(answersByIndex[idx]);
      const expected = normalizeAnswer(q.answer);
      const correct = user.length > 0 && user === expected;
      return { idx, correct };
    });

    return {
      results,
      allCorrect: results.every((r) => r.correct),
    };
  }

  function submitAttempt() {
    if (!activeChallenge) return;
    setSubmitted(true);

    const { allCorrect } = gradeAttempt(activeChallenge);

    // Award XP only once per challenge.
    if (allCorrect && !completedById[activeChallenge.id]) {
      setProgress((prev) => ({
        totalXp: (Number(prev.totalXp) || 0) + (Number(activeChallenge.xp) || 0),
        completedById: {
          ...(prev.completedById || {}),
          [activeChallenge.id]: {
            completedAt: new Date().toISOString(),
          },
        },
      }));
    }
  }

  const stats = useMemo(() => {
    const completedCount = Object.keys(completedById || {}).length;
    const totalCount = challenges.length;
    const totalXpPossible = challenges.reduce((sum, c) => sum + (c.xp || 0), 0);
    return { completedCount, totalCount, totalXpPossible };
  }, [completedById]);

  const attemptGrade = useMemo(() => {
    if (!activeChallenge || !submitted) return null;
    return gradeAttempt(activeChallenge);
  }, [activeChallenge, submitted, answersByIndex]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const c of challenges) {
      const cat = c.skill || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredCount = filteredChallenges.length;
  const totalInSelectedCategory =
    selectedCategory === "All"
      ? challenges.length
      : categoryCounts[selectedCategory] ?? 0;

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      {/* Header + stats */}
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h1 className="h1">Gamified Challenges</h1>
            <div className="muted" style={{ fontWeight: 600 }}>
              Total XP:{" "}
              <span style={{ color: "var(--color-text)" }}>
                {progress.totalXp}
              </span>{" "}
              <span style={{ fontWeight: 400 }}>/ {stats.totalXpPossible}</span>
            </div>
          </div>

          <div className="muted">
            Complete challenges to earn XP. Your progress is saved on this device.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            <div
              className="card"
              style={{
                borderRadius: 10,
                borderStyle: "dashed",
              }}
            >
              <div className="card-body" style={{ padding: 12 }}>
                <div className="muted" style={{ fontSize: 12 }}>
                  Completed
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  {stats.completedCount}/{stats.totalCount}
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{
                borderRadius: 10,
                borderStyle: "dashed",
              }}
            >
              <div className="card-body" style={{ padding: 12 }}>
                <div className="muted" style={{ fontSize: 12 }}>
                  Current streak
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>—</div>
              </div>
            </div>

            <div
              className="card"
              style={{
                borderRadius: 10,
                borderStyle: "dashed",
              }}
            >
              <div className="card-body" style={{ padding: 12 }}>
                <div className="muted" style={{ fontSize: 12 }}>
                  Rank
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>Explorer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content: either list or attempt */}
      {activeChallenge ? (
        <div className="card">
          <div className="card-body" style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "grid", gap: 4 }}>
                <div className="muted" style={{ fontWeight: 700 }}>
                  {activeChallenge.skill} • {activeChallenge.xp} XP
                </div>
                <h2 className="h2" style={{ marginTop: 2 }}>
                  {activeChallenge.title}
                </h2>
                <div className="muted">{activeChallenge.description}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-secondary" onClick={resetAttempt}>
                  Back to list
                </button>
                <button
                  className="btn btn-primary"
                  onClick={submitAttempt}
                  disabled={submitted}
                >
                  {submitted ? "Submitted" : "Submit answers"}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {activeChallenge.questions.map((q, idx) => {
                const isCorrect =
                  submitted && attemptGrade
                    ? attemptGrade.results.find((r) => r.idx === idx)?.correct
                    : null;

                return (
                  <div
                    key={`${activeChallenge.id}-${idx}`}
                    className="card"
                    style={{ borderRadius: 10 }}
                  >
                    <div className="card-body" style={{ padding: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "baseline",
                        }}
                      >
                        <div style={{ fontWeight: 800 }}>
                          Q{idx + 1}. {q.question}
                        </div>

                        {submitted ? (
                          <div
                            style={{
                              fontWeight: 800,
                              color: isCorrect
                                ? "var(--color-success)"
                                : "var(--color-danger)",
                            }}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </div>
                        ) : null}
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                        <label className="label" htmlFor={`answer-${idx}`}>
                          Your answer
                        </label>
                        <input
                          id={`answer-${idx}`}
                          className="input"
                          value={answersByIndex[idx] ?? ""}
                          onChange={(e) => onChangeAnswer(idx, e.target.value)}
                          placeholder="Type your answer..."
                          disabled={submitted}
                        />

                        {submitted && !isCorrect ? (
                          <div className="muted" style={{ fontSize: 13 }}>
                            Expected:{" "}
                            <span
                              style={{
                                fontWeight: 800,
                                color: "var(--color-text)",
                              }}
                            >
                              {q.answer}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {submitted && attemptGrade ? (
              <div
                className="card"
                style={{
                  borderRadius: 10,
                  borderColor: attemptGrade.allCorrect
                    ? "rgba(5, 150, 105, 0.35)"
                    : "rgba(220, 38, 38, 0.35)",
                  background: attemptGrade.allCorrect
                    ? "rgba(5, 150, 105, 0.06)"
                    : "rgba(220, 38, 38, 0.06)",
                }}
              >
                <div className="card-body" style={{ padding: 12 }}>
                  {attemptGrade.allCorrect ? (
                    <div style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontWeight: 900 }}>Challenge completed!</div>
                      <div className="muted">
                        {completedById[activeChallenge.id]
                          ? "XP was already awarded for this challenge."
                          : `You earned ${activeChallenge.xp} XP.`}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontWeight: 900 }}>Not quite—try again.</div>
                      <div className="muted">
                        Review the expected answers above, then return to the list
                        and start the challenge again.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ display: "grid", gap: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "baseline",
                flexWrap: "wrap",
              }}
            >
              <h2 className="h2">Available challenges</h2>
              <div className="muted">Tip: Answers are checked case-insensitively.</div>
            </div>

            {/* Filters */}
            <div
              className="card"
              style={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 10 }}
            >
              <div
                className="card-body"
                style={{
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "end",
                }}
              >
                <div style={{ display: "grid", gap: 6, minWidth: 240 }}>
                  <label
                    className="muted"
                    htmlFor="challenges_category"
                    style={{ fontSize: 13 }}
                  >
                    Category
                  </label>
                  <select
                    id="challenges_category"
                    className="input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="muted" style={{ fontSize: 13, textAlign: "right" }}>
                  Showing <strong>{filteredCount}</strong>{" "}
                  {selectedCategory === "All" ? (
                    <>
                      total <span style={{ opacity: 0.85 }}>(all categories)</span>
                    </>
                  ) : (
                    <>
                      in <strong>{selectedCategory}</strong>{" "}
                      <span style={{ opacity: 0.85 }}>
                        (of {totalInSelectedCategory} in category)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              data-challenges-grid
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {filteredChallenges.length === 0 ? (
                <div
                  className="card"
                  style={{
                    gridColumn: "1 / -1",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="card-body" style={{ display: "grid", gap: 8 }}>
                    <div className="h3" style={{ margin: 0 }}>
                      No challenges found
                    </div>
                    <div className="muted">
                      There are currently no challenges in the "{selectedCategory}"
                      category.
                    </div>
                  </div>
                </div>
              ) : (
                filteredChallenges.map((c) => {
                  const isDone = Boolean(completedById[c.id]);
                  return (
                    <div key={c.id} className="card">
                      <div className="card-body" style={{ display: "grid", gap: 10 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            alignItems: "flex-start",
                          }}
                        >
                          <div style={{ display: "grid", gap: 4 }}>
                            <div className="muted" style={{ fontWeight: 700 }}>
                              {c.skill} • {c.xp} XP
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 900 }}>
                              {c.title}
                            </div>
                          </div>

                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 12,
                              padding: "6px 10px",
                              borderRadius: 999,
                              border: "1px solid var(--color-border)",
                              background: isDone
                                ? "rgba(5, 150, 105, 0.10)"
                                : "rgba(55, 65, 81, 0.06)",
                              color: isDone
                                ? "var(--color-success)"
                                : "var(--color-text)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {isDone ? "Completed" : "New"}
                          </div>
                        </div>

                        <div className="muted">{c.description}</div>

                        <div className="muted" style={{ fontSize: 13 }}>
                          Questions:{" "}
                          <span style={{ fontWeight: 800, color: "var(--color-text)" }}>
                            {c.questions.length}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => startAttempt(c.id)}
                          >
                            {isDone ? "Retry challenge" : "Start challenge"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <style>
              {`
                @media (max-width: 900px) {
                  .container [data-challenges-grid] {
                    grid-template-columns: 1fr;
                  }
                }
              `}
            </style>
          </div>
        </div>
      )}
    </div>
  );
}
