import React, { useState, useRef, useEffect } from "react";
import mentorResponses from "../data/mentorResponses";

/**
 * Find the best matching key in mentorResponses for the user's query.
 * Returns both the matched key and the corresponding response object.
 */
function findBestMatch(query) {
  if (!query || !query.trim()) return [null, null];
  const q = query.toLowerCase();
  // Exact and substring match preference
  for (const key of Object.keys(mentorResponses)) {
    if (q === key.toLowerCase()) return [key, mentorResponses[key]];
  }
  for (const key of Object.keys(mentorResponses)) {
    if (q.includes(key.toLowerCase())) return [key, mentorResponses[key]];
    if (key.toLowerCase().includes(q)) return [key, mentorResponses[key]];
  }
  return [null, null];
}

/**
 * PUBLIC_INTERFACE
 * MentorPage presents a chat-like interface for exploring company/field/skill guidance
 * Uses mentorResponses mapping for localized, factual, resource-rich advice
 */
export default function MentorPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "mentor",
      text:
        "Hi — I'm your AI Career Mentor. Enter a company, field, or skill (e.g., Google, Data Science, Cloud) to get tailored career mentorship."
    }
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to latest message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const userMessage = input.trim();
    if (!userMessage) return;
    const [matchedKey, mentor] = findBestMatch(userMessage);

    let mentorReply;
    if (mentor) {
      mentorReply = (
        <div>
          <strong>{matchedKey}</strong>
          {mentor.description && (
            <p className="mentor-desc">{mentor.description}</p>
          )}
          {mentor.guidance && (
            <>
              <h4>Career Guidance</h4>
              <ul>
                {mentor.guidance.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {mentor.resources && (
            <>
              <h4>Key Resources</h4>
              <ul>
                {mentor.resources.map((res, idx) => (
                  <li key={idx}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {res.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
    } else {
      mentorReply =
        "Sorry, I couldn't find guidance for that topic. Try a common company or area like Google, Data Science, or Cloud.";
    }

    setMessages((msgs) => [
      ...msgs,
      { id: `u_${Date.now()}`, role: "user", text: userMessage },
      { id: `m_${Date.now()}`, role: "mentor", text: mentorReply }
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 700, margin: "48px auto" }}>
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ marginBottom: 0, fontSize: 28 }}>AI Career Mentor</h2>
          <div className="muted" style={{ marginBottom: 12, fontSize: 15 }}>
            Guidance and resources for top companies and career fields. Try: Google, Microsoft, Data Science, Cloud...
          </div>
          <div
            ref={chatRef}
            role="log"
            aria-label="Mentor chat messages"
            style={{
              minHeight: 250,
              maxHeight: 340,
              overflowY: "auto",
              background: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
              display: "grid",
              gap: 14
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={m.id}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  color: m.role === "user" ? "#374151" : "#059669"
                }}
              >
                {m.role === "mentor" ? (
                  <div>{typeof m.text === "string" ? <span>{m.text}</span> : m.text}</div>
                ) : (
                  <div>
                    <strong>You:</strong> {m.text}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div>
            <textarea
              className="mentor-input textarea"
              rows={2}
              placeholder="Enter a company, field, or skill and press Enter..."
              value={input}
              style={{ width: "100%", fontSize: 16, padding: 10, borderRadius: 6, boxSizing: "border-box" }}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Mentor input"
            />
            <button
              type="button"
              className="mentor-submit btn btn-primary"
              style={{ marginTop: 8, float: "right" }}
              onClick={handleSend}
              disabled={!input.trim()}
            >
              Get Guidance
            </button>
          </div>
          <div style={{ clear: "both" }} />
        </div>
      </div>
    </div>
  );
}
