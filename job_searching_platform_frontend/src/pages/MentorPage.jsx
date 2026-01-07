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
 * Simple intent detection based on the provided mentor instruction template.
 * We keep it lightweight and local (no backend / LLM call), but enforce the rules:
 * - Job rejection: 2–3 possible reasons + practical improvements, supportive tone
 * - Profile rejection: missing skills/weak sections/incomplete profile + exact improvements, non-harsh tone
 * - Company: short factual 2–3 lines, mention industry & core focus, no speculation
 */
function detectMentorIntent(userMessage) {
  const n = normalizeText(userMessage);

  if (!n) return "fallback";

  const hasAny = (phrases) => phrases.some((p) => n.includes(p));

  // Company intent: user asking "what is <company>" or "tell me about <company>"
  const companyIntent =
    /\b(company|organization|employer)\b/.test(n) ||
    hasAny([
      "tell me about",
      "what is",
      "who is",
      "about ",
      "company description",
      "describe ",
      "overview of"
    ]);

  // Job rejection intent: "job application rejected", "rejected after interview", etc.
  const jobRejectionIntent =
    hasAny([
      "job rejection",
      "application rejected",
      "rejected my application",
      "got rejected",
      "got declined",
      "declined my application",
      "rejected after",
      "rejection email",
      "not selected",
      "position filled",
      "we decided to move forward",
      "unfortunately"
    ]) ||
    (n.includes("rejected") && hasAny(["job", "role", "position", "application"]));

  // Profile rejection intent: "profile rejected", "profile not approved", etc.
  const profileRejectionIntent =
    hasAny([
      "profile rejected",
      "profile rejection",
      "profile not approved",
      "profile declined",
      "account not approved",
      "verification failed",
      "profile review failed",
      "resume rejected",
      "cv rejected",
      "my profile was rejected"
    ]) ||
    (n.includes("rejected") && hasAny(["profile", "resume", "cv", "account"]));

  // Disambiguation: if both appear, prefer profile rejection when "profile/resume/cv" is present.
  if (profileRejectionIntent) return "profile_rejection";
  if (jobRejectionIntent) return "job_rejection";

  // Company intent should be after rejection checks to avoid interpreting "company rejected me"
  // as a company-description request.
  if (companyIntent && !hasAny(["rejected me", "rejection", "declined me"])) {
    return "company_description";
  }

  return "fallback";
}

function buildJobRejectionResponse(userMessage) {
  // Supportive, 2–3 reasons, practical improvements.
  // Keep content general (we don't have their full profile/role details).
  return [
    "It’s frustrating to get a rejection, but it’s also common — and you can use it to sharpen your next application.",
    "",
    "Here are 2–3 likely reasons:",
    "1) The role had very strong competition or the employer prioritized candidates with closer experience (same tech stack, domain, or seniority).",
    "2) Your resume didn’t clearly show impact (metrics, outcomes) or the required keywords/skills weren’t obvious at a quick scan.",
    "3) Timing/fit factors: the position may have been filled internally, paused, or your availability/location/comp expectations didn’t match.",
    "",
    "Practical improvements you can make this week:",
    "- Tailor your top 3–5 bullets to mirror the job description (skills + responsibilities) and add measurable outcomes where possible.",
    "- Add 1–2 relevant projects that demonstrate the exact stack the role asks for, with links and clear results.",
    "- If you interviewed: write down the questions you struggled with and practice those topics with 2–3 mock sessions.",
    "",
    "If you paste the job description and what stage you were rejected (applied / recruiter screen / interview), I can suggest more targeted fixes."
  ].join("\n");
}

function buildProfileRejectionResponse(userMessage) {
  // Gentle tone; identify typical gaps; suggest exact improvements (skills, projects, keywords).
  return [
    "A profile rejection usually means something in the profile/resume didn’t meet the platform’s completeness or relevance checks — it’s fixable.",
    "",
    "Common reasons (and what to improve):",
    "1) Incomplete or unclear sections: missing job titles, dates, location, portfolio/GitHub links, or a short summary.",
    "2) Weak evidence of skills: skills are listed, but there aren’t projects/work bullets proving them.",
    "3) Keyword mismatch: your profile doesn’t match the role types you’re applying for (e.g., “React” roles but no React projects/keywords).",
    "",
    "Exact improvements to try:",
    "- Add a 2–3 line headline/summary: target role + core stack + 1 proof point (e.g., “Built X using Y”).",
    "- Update experience/project bullets to follow: Action + Tech + Result (include numbers when possible).",
    "- Add 6–12 specific skills aligned to your target roles (e.g., React, TypeScript, Node.js, SQL, REST APIs, Git) and back them with at least 1 project each.",
    "- Ensure your profile has working links (LinkedIn, GitHub, portfolio) and consistent dates/titles.",
    "",
    "If you share the rejection message (or the sections you’re unsure about), I can point out the most likely missing pieces and the best keywords to add."
  ].join("\n");
}

function extractCompanyName(userMessage) {
  const raw = (userMessage || "").trim();
  const n = normalizeText(raw);

  // Try patterns: "tell me about X", "what is X", "describe X", "company X"
  const patterns = [
    /tell me about\s+(.+)/i,
    /what is\s+(.+)/i,
    /who is\s+(.+)/i,
    /describe\s+(.+)/i,
    /overview of\s+(.+)/i,
    /\bcompany\s+([a-z0-9][a-z0-9\s&.-]{1,60})/i
  ];

  for (const p of patterns) {
    const m = raw.match(p);
    if (m && m[1]) {
      const candidate = m[1].trim();
      // Avoid returning overly long text (e.g., the entire message).
      if (candidate.length >= 2 && candidate.length <= 70) return candidate;
    }
  }

  // Fallback: if message contains "company" but no clear name, return empty.
  if (n.includes("company")) return "";

  // Otherwise, not sure.
  return "";
}

function buildCompanyDescriptionResponse(userMessage) {
  const company = extractCompanyName(userMessage);

  // We must avoid speculation. Without an external data source, we can provide a factual-style,
  // generic description and ask a clarifying question for accuracy.
  if (!company) {
    return [
      "I can help with a short company description.",
      "Which company name should I describe (e.g., “Google”, “Infosys”, “Stripe”) ?"
    ].join("\n");
  }

  return [
    `${company} is a company that operates within its core industry to deliver products and services to customers.`,
    "In a professional context, it typically focuses on solving specific customer/business problems through technology, operations, and/or service delivery.",
    "If you tell me the company’s website or industry (e.g., fintech, healthcare, SaaS), I can refine this into a precise 2–3 line description without guessing."
  ].join("\n");
}

/**
 * Generate a mentor reply following the attached instruction template.
 * Falls back to existing keyword dataset for general career topics.
 */
function generateMentorReply(userMessage, responses) {
  const intent = detectMentorIntent(userMessage);

  if (intent === "job_rejection") return buildJobRejectionResponse(userMessage);
  if (intent === "profile_rejection")
    return buildProfileRejectionResponse(userMessage);
  if (intent === "company_description")
    return buildCompanyDescriptionResponse(userMessage);

  // Fallback to existing keyword-based guidance for general topics (frontend/backend/react/skills/job, etc.)
  const keywordReply = findMentorReply(userMessage, responses);
  if (keywordReply) return keywordReply;

  return "Tell me what you’re working on (job rejection, profile rejection, or a company you want to know about), and I’ll guide you with specific next steps.";
}

/**
 * PUBLIC_INTERFACE
 * MentorPage provides a local "AI Career Mentor" experience backed by:
 * - rule-based intent selection (job rejection, profile rejection, company descriptions)
 * - fallback keyword-response dataset for general career topics
 */
export default function MentorPage() {
  const responses = useMemo(() => mentorResponses, []);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "m0",
      role: "mentor",
      text:
        "Hi — I’m your AI Career Mentor. Ask about job rejection, profile rejection, or ask for a company description, and I’ll respond with practical next steps."
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

    const reply = generateMentorReply(trimmed, responses);

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
              Mentor replies follow built-in guidance rules (job rejection,
              profile rejection, and company descriptions) with keyword-based
              help for general topics.
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
                          "Hi — I’m your AI Career Mentor. Ask about job rejection, profile rejection, or ask for a company description, and I’ll respond with practical next steps."
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
                      onClick={() =>
                        setInput((prev) => (prev ? `${prev} ${k}` : k))
                      }
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="muted" style={{ fontSize: 12 }}>
                Matching behavior: the mentor first applies the instruction
                rules (job rejection / profile rejection / company description);
                otherwise it falls back to keyword guidance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
