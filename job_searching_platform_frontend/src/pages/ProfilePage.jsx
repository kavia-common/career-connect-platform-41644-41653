import React from "react";

/**
 * PUBLIC_INTERFACE
 * Skill-based Profile placeholder page.
 */
export default function ProfilePage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Skill-based Profile</h1>
          <div className="muted">
            Placeholder for profile editor. Will use <code>GET /profiles/me</code>{" "}
            and <code>PUT /profiles/skills</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
