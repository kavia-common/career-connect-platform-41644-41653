import React from "react";

/**
 * PUBLIC_INTERFACE
 * AI Career Mentor placeholder page.
 */
export default function MentorPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">AI Career Mentor</h1>
          <div className="muted">
            Placeholder for mentor chat. Will use <code>POST /ai/mentor</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
