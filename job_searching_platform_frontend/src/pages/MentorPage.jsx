import React, { useEffect, useMemo, useRef, useState } from "react";
import { mentorResponses } from "../data/mentorResponses";

/**
 * Normalize user input for matching:
 * - lowercase
 * - replace non-alphanumeric with spaces
 * - collapse whitespace
 */
function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Find first matching mentor response based on keyword occurrence.
 * We do a simple "word boundary-ish" match by tokenizing input.
 */
function findMentorReply(userMessage, responses) {
  const normalized = normalizeText(userMessage);
  if (!normalized) return null;

  const tokens = new Set(normalized.split(" ").filter(Boolean));
  const match = responses.find((r) => tokens.has(normalizeText(r.keyword)));
  return match ? match.response : null;
}

/**
 * PUBLIC_INTERFACE
 * MentorPage provides a local "AI Career Mentor" experience backed by a keyword-response dataset.
 * Users type a question, and the mentor replies when a keyword is detected.
 */
export default function MentorPage() {
  const responses = useMemo(() => mentorResponses, []);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "m0",
      role: "mentor",
      text:
        "Hi — I’m your AI Career Mentor. Ask about frontend, backend, react, skills, or job search and I’ll respond with targeted guidance."
    }
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the latest message.
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const suggestions = useMemo(
    () => responses.map((r) => r.keyword).slice(0, 8),
    [responses]
  );

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed
    };

    const reply =
      findMentorReply(trimmed, responses) ||
      "I didn’t catch a matching topic. Try keywords like frontend, backend, react, skills, or job.";

    const mentorMsg = {
      id: `m-${Date.now()}-r`,
      role: "mentor",
      text: reply
    };

    setMessages((prev) => [...prev, userMsg, mentorMsg]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    // Send on Enter, allow newline with Shift+Enter.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1">AI Career Mentor</h1>
            <div className="muted">
              Keyword-based mentor replies using a local dataset (no backend call
              required).
            </div>
          </div>

          <div
            className="card"
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--color-border)"
            }}
          >
            <div
              ref={listRef}
              aria-label="Mentor chat messages"
              role="log"
              style={{
                height: 360,
                overflow: "auto",
                padding: 12,
                background: "var(--color-bg)",
                display: "grid",
                gap: 10
              }}
            >
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start"
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                        background: isUser
                          ? "rgba(55, 65, 81, 0.10)"
                          : "var(--color-surface)",
                        color: "var(--color-text)",
                        boxShadow: "var(--shadow-sm)",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.35
                      }}
                    >
                      <div
                        className="muted"
                        style={{
                          fontSize: 12,
                          marginBottom: 6,
                          color: "var(--color-text-muted)"
                        }}
                      >
                        {isUser ? "You" : "Mentor"}
                      </div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                padding: 12,
                display: "grid",
                gap: 10
              }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                <label className="label" htmlFor="mentor-input">
                  Your message
                </label>
                <textarea
                  id="mentor-input"
                  className="textarea"
                  rows={3}
                  placeholder="Ask a question… (Enter to send, Shift+Enter for newline)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setMessages([
                      {
                        id: "m0",
                        role: "mentor",
                        text:
                          "Hi — I’m your AI Career Mentor. Ask about frontend, backend, react, skills, or job search and I’ll respond with targeted guidance."
                      }
                    ])
                  }
                >
                  Reset
                </button>

                <div className="muted" style={{ fontSize: 13 }}>
                  Try:{" "}
                  {suggestions.map((k, idx) => (
                    <button
                      key={k}
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontWeight: 600,
                        marginLeft: idx === 0 ? 6 : 6
                      }}
                      onClick={() => setInput((prev) => (prev ? `${prev} ${k}` : k))}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="muted" style={{ fontSize: 12 }}>
                Matching behavior: your message is tokenized and the first
                matching keyword triggers its predefined response.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
