import React, { useEffect, useMemo, useState } from "react";
import { mockTestCategories, mockTests } from "../data/mockTestsData";

const STORAGE_KEY = "cc.mockTests.progress.v1";

function safeParseJson(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const DIFFICULTY_OPTIONS = ["All", "Easy", "Medium", "Hard"];

/**
 * PUBLIC_INTERFACE
 * Mock Tests page: list available mock tests, allow taking a test, track answers,
 * show score and correct answers at the end, and persist minimal progress locally.
 */
export default function MockTestsPage() {
  const [progressByTestId, setProgressByTestId] = useState({});
  const [activeTestId, setActiveTestId] = useState(null);

  // Category becomes the primary browsing mechanism:
  // - default to first real category (not "All")
  // - do not show an "All categories" combined view
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Load persisted progress once.
  useEffect(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEY), {});
    if (stored && typeof stored === "object") setProgressByTestId(stored);
  }, []);

  // Persist progress whenever it changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressByTestId));
  }, [progressByTestId]);

  const allCategories = useMemo(() => {
    /**
     * We want the dropdown to show:
     * All, React, Java, Python, then any remaining categories alphabetically.
     *
     * We still keep this resilient:
     * - Prefer `mockTestCategories` if provided
     * - Fall back to deriving from dataset
     */
    const derived = Array.from(
      new Set(mockTests.map((t) => t.category).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    const fromExport = Array.isArray(mockTestCategories)
      ? mockTestCategories
      : derived;

    const unique = Array.from(new Set(fromExport.filter(Boolean)));

    const PRIORITY = ["All", "React", "Java", "Python"];
    const prioritySet = new Set(PRIORITY);

    const prioritized = PRIORITY.filter((c) => unique.includes(c));
    const rest = unique
      .filter((c) => !prioritySet.has(c))
      .sort((a, b) => a.localeCompare(b));

    // Ensure "All" exists even if export/data drifted (so filter still supports All view).
    if (!prioritized.includes("All")) prioritized.unshift("All");

    return [...prioritized, ...rest];
  }, []);

  // When categories are available, ensure we always have an active category selected.
  useEffect(() => {
    if (!selectedCategory && allCategories.length > 0) {
      setSelectedCategory(allCategories[0]);
    } else if (
      selectedCategory &&
      allCategories.length > 0 &&
      !allCategories.includes(selectedCategory)
    ) {
      // Dataset changed: fall back to first available category.
      setSelectedCategory(allCategories[0]);
    }
  }, [allCategories, selectedCategory]);

  const allDifficulties = useMemo(() => {
    // Keep UI stable ("All/Easy/Medium/Hard") but allow dataset drift safely.
    const dataset = new Set(
      mockTests
        .map((t) => t.difficulty)
        .filter((d) => typeof d === "string" && d.trim().length > 0)
    );

    // If dataset has unknown difficulty values, include them after the known ones.
    const extras = Array.from(dataset).filter(
      (d) => !DIFFICULTY_OPTIONS.includes(d)
    );
    return [...DIFFICULTY_OPTIONS, ...extras];
  }, []);

  const filteredTests = useMemo(() => {
    // With "All", category is optional. If not set yet, show all.
    if (!selectedCategory) return mockTests;

    return mockTests.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" ? true : t.category === selectedCategory;

      const matchesDifficulty =
        !selectedDifficulty || selectedDifficulty === "All"
          ? true
          : t.difficulty === selectedDifficulty;

      return matchesCategory && matchesDifficulty;
    });
  }, [selectedCategory, selectedDifficulty]);

  const activeTest = useMemo(
    () => mockTests.find((t) => t.id === activeTestId) || null,
    [activeTestId]
  );

  const activeProgress = useMemo(() => {
    if (!activeTest) return null;
    const existing = progressByTestId[String(activeTest.id)];
    if (existing && typeof existing === "object") return existing;

    // Default progress
    return {
      status: "in_progress", // in_progress | completed
      startedAt: new Date().toISOString(),
      currentIndex: 0,
      answers: {}, // questionId -> optionIndex
      submittedAt: null,
      score: null,
    };
  }, [activeTest, progressByTestId]);

  const activeQuestion = useMemo(() => {
    if (!activeTest || !activeProgress) return null;
    const idx = clampIndex(activeProgress.currentIndex, activeTest.questions.length);
    return activeTest.questions[idx] || null;
  }, [activeTest, activeProgress]);

  // Ensure currentIndex stays valid if dataset changes.
  useEffect(() => {
    if (!activeTest || !activeProgress) return;
    const max = activeTest.questions.length;
    const clamped = clampIndex(activeProgress.currentIndex, max);
    if (clamped !== activeProgress.currentIndex) {
      setProgressByTestId((prev) => ({
        ...prev,
        [String(activeTest.id)]: { ...activeProgress, currentIndex: clamped },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTestId]);

  function clampIndex(i, length) {
    if (length <= 0) return 0;
    if (i < 0) return 0;
    if (i >= length) return length - 1;
    return i;
  }

  function computeScore(test, answers) {
    let correct = 0;
    for (const q of test.questions) {
      const chosen = answers?.[String(q.id)];
      if (typeof chosen === "number" && chosen === q.correctAnswer) correct += 1;
    }
    return correct;
  }

  function ensureTestProgressInitialized(testId) {
    const test = mockTests.find((t) => t.id === testId);
    if (!test) return;

    setProgressByTestId((prev) => {
      const key = String(testId);
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: {
          status: "in_progress",
          startedAt: new Date().toISOString(),
          currentIndex: 0,
          answers: {},
          submittedAt: null,
          score: null,
        },
      };
    });
  }

  function startOrResumeTest(testId) {
    ensureTestProgressInitialized(testId);
    setActiveTestId(testId);
  }

  function setAnswerForActive(questionId, optionIndex) {
    if (!activeTest || !activeProgress) return;
    if (activeProgress.status !== "in_progress") return;

    setProgressByTestId((prev) => {
      const key = String(activeTest.id);
      const current = prev[key] || activeProgress;
      return {
        ...prev,
        [key]: {
          ...current,
          answers: { ...(current.answers || {}), [String(questionId)]: optionIndex },
        },
      };
    });
  }

  function goToQuestion(index) {
    if (!activeTest || !activeProgress) return;
    if (activeProgress.status !== "in_progress") return;

    const clamped = clampIndex(index, activeTest.questions.length);
    setProgressByTestId((prev) => {
      const key = String(activeTest.id);
      const current = prev[key] || activeProgress;
      return {
        ...prev,
        [key]: { ...current, currentIndex: clamped },
      };
    });
  }

  function submitActiveTest() {
    if (!activeTest || !activeProgress) return;
    if (activeProgress.status !== "in_progress") return;

    const score = computeScore(activeTest, activeProgress.answers || {});
    setProgressByTestId((prev) => {
      const key = String(activeTest.id);
      const current = prev[key] || activeProgress;
      return {
        ...prev,
        [key]: {
          ...current,
          status: "completed",
          submittedAt: new Date().toISOString(),
          score,
        },
      };
    });
  }

  function resetTest(testId) {
    const test = mockTests.find((t) => t.id === testId);
    if (!test) return;

    setProgressByTestId((prev) => ({
      ...prev,
      [String(testId)]: {
        status: "in_progress",
        startedAt: new Date().toISOString(),
        currentIndex: 0,
        answers: {},
        submittedAt: null,
        score: null,
      },
    }));
  }

  function exitToList() {
    setActiveTestId(null);
  }

  const pageHeader = (
    <div className="card">
      <div className="card-body" style={{ display: "grid", gap: 8 }}>
        <h1 className="h1">Mock Tests</h1>
        <div className="muted">
          Practice with short mock tests. Your in-progress attempt is saved locally
          on this device.
        </div>
      </div>
    </div>
  );

  const filterBars = !activeTest ? (
    <FiltersPanel
      categories={allCategories}
      difficulties={allDifficulties}
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      selectedDifficulty={selectedDifficulty}
      onSelectDifficulty={setSelectedDifficulty}
      tests={mockTests}
      filteredCount={filteredTests.length}
    />
  ) : null;

  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      {pageHeader}
      {filterBars}

      {!activeTest ? (
        <TestsList
          tests={filteredTests}
          progressByTestId={progressByTestId}
          onStartOrResume={startOrResumeTest}
          onReset={resetTest}
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
        />
      ) : (
        <TestRunner
          test={activeTest}
          progress={activeProgress}
          activeQuestion={activeQuestion}
          onExit={exitToList}
          onSelectOption={setAnswerForActive}
          onGoToQuestion={goToQuestion}
          onSubmit={submitActiveTest}
          onReset={() => resetTest(activeTest.id)}
        />
      )}
    </div>
  );
}

function formatStatus(progress) {
  if (!progress) return "Not started";
  if (progress.status === "completed") return "Completed";
  if (progress.status === "in_progress") return "In progress";
  return "Not started";
}

function countAnswered(test, progress) {
  const answers = progress?.answers || {};
  let answered = 0;
  for (const q of test.questions) {
    if (typeof answers[String(q.id)] === "number") answered += 1;
  }
  return answered;
}

function getDifficultyBadgeStyle(difficulty) {
  // Keep within the current theme by using subtle tinted backgrounds (no new CSS needed).
  if (difficulty === "Easy") return { background: "rgba(5, 150, 105, 0.10)", color: "#065F46" };
  if (difficulty === "Medium") return { background: "rgba(55, 65, 81, 0.10)", color: "#374151" };
  if (difficulty === "Hard") return { background: "rgba(220, 38, 38, 0.10)", color: "#991B1B" };
  return undefined;
}

function FiltersPanel({
  categories,
  difficulties,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  tests,
  filteredCount,
}) {
  const countsByCategory = useMemo(() => {
    const counts = {};
    for (const t of tests) {
      const cat = t.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [tests]);

  const countsByDifficulty = useMemo(() => {
    const counts = {};
    for (const t of tests) {
      const diff = t.difficulty || "Other";
      counts[diff] = (counts[diff] || 0) + 1;
    }
    return counts;
  }, [tests]);

  const totalInSelectedCategory = selectedCategory
    ? countsByCategory[selectedCategory] ?? 0
    : 0;

  // Keep Difficulty counts meaningful for the currently selected category.
  const countsByDifficultyInSelectedCategory = useMemo(() => {
    const counts = {};
    for (const t of tests) {
      if (!selectedCategory || t.category !== selectedCategory) continue;
      const diff = t.difficulty || "Other";
      counts[diff] = (counts[diff] || 0) + 1;
    }
    return counts;
  }, [tests, selectedCategory]);

  const allInSelectedCategoryForDifficulty = selectedCategory
    ? totalInSelectedCategory
    : tests.length;

  return (
    <div className="card">
      <div className="card-body" style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
              <label
                className="muted"
                htmlFor="mocktests_category"
                style={{ fontSize: 13 }}
              >
                Category
              </label>
              <select
                id="mocktests_category"
                className="input"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
              <label
                className="muted"
                htmlFor="mocktests_difficulty"
                style={{ fontSize: 13 }}
              >
                Difficulty
              </label>
              <select
                id="mocktests_difficulty"
                className="input"
                value={selectedDifficulty}
                onChange={(e) => onSelectDifficulty(e.target.value)}
              >
                {difficulties.map((diff) => {
                  const count =
                    diff === "All"
                      ? allInSelectedCategoryForDifficulty
                      : (countsByDifficultyInSelectedCategory[diff] ??
                        countsByDifficulty[diff] ??
                        0);

                  return (
                    <option key={diff} value={diff}>
                      {diff} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="muted" style={{ fontSize: 13, textAlign: "right" }}>
            {selectedCategory ? (
              <>
                Showing <strong>{filteredCount}</strong> in{" "}
                <strong>{selectedCategory}</strong>{" "}
                <span style={{ opacity: 0.8 }}>
                  (of {totalInSelectedCategory} in category)
                </span>
              </>
            ) : (
              <>
                Showing <strong>{filteredCount}</strong>
              </>
            )}
          </div>
        </div>

        <div className="muted" style={{ fontSize: 13 }}>
          Tip: category is the primary browsing mode; difficulty narrows results within
          the selected category.
        </div>
      </div>
    </div>
  );
}

function TestsList({
  tests,
  progressByTestId,
  onStartOrResume,
  onReset,
  selectedCategory,
  selectedDifficulty,
}) {
  const emptyState = (
    <div className="card" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
      <div className="card-body" style={{ display: "grid", gap: 8 }}>
        <div className="h3" style={{ margin: 0 }}>
          No tests found
        </div>
        <div className="muted">
          {selectedCategory && selectedCategory !== "All"
            ? `There are currently no tests in the "${selectedCategory}" category.`
            : selectedDifficulty && selectedDifficulty !== "All"
              ? `There are currently no "${selectedDifficulty}" difficulty tests.`
              : "There are currently no tests to display."}
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-body" style={{ display: "grid", gap: 12 }}>
        <h2 className="h2" style={{ margin: 0 }}>
          Available tests
        </h2>

        <div style={{ display: "grid", gap: 10 }}>
          {tests.length === 0
            ? emptyState
            : tests.map((t) => {
                const progress = progressByTestId[String(t.id)];
                const status = formatStatus(progress);
                const answered = progress ? countAnswered(t, progress) : 0;
                const isCompleted = progress?.status === "completed";
                const primaryCta = isCompleted
                  ? "Review results"
                  : progress
                    ? "Resume"
                    : "Start";

                return (
                  <div
                    key={t.id}
                    className="card"
                    style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className="card-body"
                      style={{
                        display: "grid",
                        gap: 10,
                        gridTemplateColumns: "1fr auto",
                        alignItems: "start",
                      }}
                    >
                      <div style={{ display: "grid", gap: 6 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <div className="h3" style={{ margin: 0 }}>
                            {t.title}
                          </div>
                          <span className="badge">{t.category || t.skill}</span>
                          {t.difficulty ? (
                            <span
                              className="badge"
                              style={getDifficultyBadgeStyle(t.difficulty)}
                              title={`Difficulty: ${t.difficulty}`}
                            >
                              {t.difficulty}
                            </span>
                          ) : null}
                        </div>

                        <div
                          className="muted"
                          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                        >
                          <span>{t.totalQuestions} questions</span>
                          <span>•</span>
                          <span>{t.duration}</span>
                          <span>•</span>
                          <span>Status: {status}</span>
                          {progress?.status === "in_progress" ? (
                            <>
                              <span>•</span>
                              <span>
                                Progress: {answered}/{t.questions.length}
                              </span>
                            </>
                          ) : null}
                          {progress?.status === "completed" ? (
                            <>
                              <span>•</span>
                              <span>
                                Score: {progress.score}/{t.questions.length}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button className="btn" onClick={() => onStartOrResume(t.id)}>
                          {primaryCta}
                        </button>
                        {progress ? (
                          <button
                            className="btn btn-ghost"
                            onClick={() => onReset(t.id)}
                            title="Reset removes local progress for this test"
                          >
                            Reset
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="muted" style={{ fontSize: 13 }}>
          Note: progress is stored in <code>localStorage</code> for this browser.
        </div>
      </div>
    </div>
  );
}

function TestRunner({
  test,
  progress,
  activeQuestion,
  onExit,
  onSelectOption,
  onGoToQuestion,
  onSubmit,
  onReset,
}) {
  const questions = test.questions || [];
  const isCompleted = progress?.status === "completed";
  const answers = progress?.answers || {};

  const answeredCount = useMemo(() => countAnswered(test, progress), [test, progress]);
  const total = questions.length;
  const currentIndex = clampIndex(progress?.currentIndex ?? 0, total);
  const chosenForActive = activeQuestion ? answers[String(activeQuestion.id)] : undefined;

  function clampIndex(i, length) {
    if (length <= 0) return 0;
    if (i < 0) return 0;
    if (i >= length) return length - 1;
    return i;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <div
          className="card-body"
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "1fr auto",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div className="h2" style={{ margin: 0 }}>
              {test.title}
            </div>
            <div className="muted" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span className="badge">{test.category || test.skill}</span>
              {test.difficulty ? (
                <span className="badge" style={getDifficultyBadgeStyle(test.difficulty)}>
                  {test.difficulty}
                </span>
              ) : null}
              <span>{total} questions</span>
              <span>•</span>
              <span>{test.duration}</span>
              <span>•</span>
              <span>
                Answered: {answeredCount}/{total}
              </span>
              {isCompleted ? (
                <>
                  <span>•</span>
                  <span>
                    Score: {progress.score}/{total}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={onExit}>
              Back to list
            </button>
            <button className="btn btn-ghost" onClick={onReset} title="Start over">
              Reset
            </button>
          </div>
        </div>
      </div>

      {isCompleted ? (
        <ResultsView test={test} progress={progress} onRetake={onReset} />
      ) : (
        <div className="card">
          <div className="card-body" style={{ display: "grid", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 10,
              }}
            >
              <div className="muted">
                Question {currentIndex + 1} of {total}
              </div>

              <div className="h3" style={{ margin: 0 }}>
                {activeQuestion?.question || "No question found."}
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {(activeQuestion?.options || []).map((opt, idx) => {
                  const selected = chosenForActive === idx;
                  return (
                    <label
                      key={idx}
                      className="card"
                      style={{
                        cursor: "pointer",
                        border: selected
                          ? "1px solid rgba(55, 65, 81, 0.35)"
                          : "1px solid rgba(0,0,0,0.06)",
                        background: selected ? "rgba(55, 65, 81, 0.06)" : "transparent",
                      }}
                    >
                      <div
                        className="card-body"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: 12,
                        }}
                      >
                        <input
                          type="radio"
                          name={`q_${activeQuestion?.id}`}
                          checked={selected}
                          onChange={() => onSelectOption(activeQuestion.id, idx)}
                        />
                        <div>{opt}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => onGoToQuestion(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => onGoToQuestion(currentIndex + 1)}
                  disabled={currentIndex === total - 1}
                >
                  Next
                </button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn"
                  onClick={onSubmit}
                  disabled={answeredCount < total}
                  title={
                    answeredCount < total
                      ? "Answer all questions to submit."
                      : "Submit test."
                  }
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="muted" style={{ fontSize: 13 }}>
              Tip: you can submit once all questions are answered.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultsView({ test, progress, onRetake }) {
  const answers = progress?.answers || {};
  const total = test.questions.length;
  const score = typeof progress?.score === "number" ? progress.score : 0;

  return (
    <div className="card">
      <div className="card-body" style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div className="h2" style={{ margin: 0 }}>
              Results
            </div>
            <div className="muted">
              You scored{" "}
              <strong>
                {score}/{total}
              </strong>
              .
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={onRetake}>
              Retake
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {test.questions.map((q, idx) => {
            const chosen = answers[String(q.id)];
            const chosenText =
              typeof chosen === "number" ? q.options[chosen] : "No answer";
            const correctText = q.options[q.correctAnswer];
            const isCorrect =
              typeof chosen === "number" && chosen === q.correctAnswer;

            const explanation =
              typeof q.explanation === "string" ? q.explanation.trim() : "";

            return (
              <div
                key={q.id}
                className="card"
                style={{
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: isCorrect
                    ? "rgba(5, 150, 105, 0.06)"
                    : "rgba(220, 38, 38, 0.04)",
                }}
              >
                <div className="card-body" style={{ display: "grid", gap: 8 }}>
                  <div className="muted">Question {idx + 1}</div>
                  <div style={{ fontWeight: 600 }}>{q.question}</div>

                  <div style={{ display: "grid", gap: 6 }}>
                    <div>
                      Your answer:{" "}
                      <strong style={{ color: isCorrect ? "#059669" : "#DC2626" }}>
                        {chosenText}
                      </strong>
                    </div>
                    <div>
                      Correct answer: <strong>{correctText}</strong>
                    </div>

                    {explanation ? (
                      <div
                        style={{
                          marginTop: 6,
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid rgba(0,0,0,0.06)",
                          background: "rgba(55, 65, 81, 0.04)",
                        }}
                      >
                        <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
                          Explanation
                        </div>
                        <div style={{ lineHeight: 1.45 }}>{explanation}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="muted" style={{ fontSize: 13 }}>
          Completed at:{" "}
          {progress?.submittedAt
            ? new Date(progress.submittedAt).toLocaleString()
            : "—"}
        </div>
      </div>
    </div>
  );
}
