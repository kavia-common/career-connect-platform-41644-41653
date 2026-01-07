import React from "react";

/**
 * PUBLIC_INTERFACE
 * AI Job Matching placeholder page.
 */
export default function AiJobMatchingPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">AI Job Matching</h1>
          <div className="muted">
            Placeholder for AI match UI. Will use <code>POST /ai/match</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
