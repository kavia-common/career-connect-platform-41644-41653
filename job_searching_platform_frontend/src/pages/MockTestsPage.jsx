import React, { useEffect, useMemo, useState } from "react";
import { mockTests } from "../data/mockTestsData";

const STORAGE_KEY = "cc.mockTests.progress.v1";

function safeParseJson(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * PUBLIC_INTERFACE
 * Mock Tests page: list available mock tests, allow taking a test, track answers,
 * show score and correct answers at the end, and persist minimal progress locally.
 */
export default function MockTestsPage() {
  const [progressByTestId, setProgressByTestId] = useState({});
  const [activeTestId, setActiveTestId] = useState(null);

  // Load persisted progress once.
  useEffect(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEY), {});
    if (stored && typeof stored === "object") setProgressByTestId(stored);
  }, []);

  // Persist progress whenever it changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressByTestId));
  }, [progressByTestId]);

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

  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      {pageHeader}

      {!activeTest ? (
        <TestsList
          tests={mockTests}
          progressByTestId={progressByTestId}
          onStartOrResume={startOrResumeTest}
          onReset={resetTest}
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

function TestsList({ tests, progressByTestId, onStartOrResume, onReset }) {
  return (
    <div className="card">
      <div className="card-body" style={{ display: "grid", gap: 12 }}>
        <h2 className="h2" style={{ margin: 0 }}>
          Available tests
        </h2>

        <div style={{ display: "grid", gap: 10 }}>
          {tests.map((t) => {
            const progress = progressByTestId[String(t.id)];
            const status = formatStatus(progress);
            const answered = progress ? countAnswered(t, progress) : 0;
            const isCompleted = progress?.status === "completed";
            const primaryCta = isCompleted ? "Review results" : progress ? "Resume" : "Start";

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
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <div className="h3" style={{ margin: 0 }}>
                        {t.title}
                      </div>
                      <span className="badge">{t.skill}</span>
                    </div>

                    <div className="muted" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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

                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
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
              <span className="badge">{test.skill}</span>
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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
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
            const isCorrect = typeof chosen === "number" && chosen === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="card"
                style={{
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: isCorrect ? "rgba(5, 150, 105, 0.06)" : "rgba(220, 38, 38, 0.04)",
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="muted" style={{ fontSize: 13 }}>
          Completed at:{" "}
          {progress?.submittedAt ? new Date(progress.submittedAt).toLocaleString() : "—"}
        </div>
      </div>
    </div>
  );
}
