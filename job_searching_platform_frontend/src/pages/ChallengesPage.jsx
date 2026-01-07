import React from "react";

/**
 * PUBLIC_INTERFACE
 * Gamified Challenges placeholder page.
 */
export default function ChallengesPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Gamified Challenges</h1>
          <div className="muted">
            Placeholder. Will use <code>GET /challenges</code> and join/complete
            endpoints.
          </div>
        </div>
      </div>
    </div>
  );
}
