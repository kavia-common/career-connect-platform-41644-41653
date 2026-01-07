import React from "react";

/**
 * PUBLIC_INTERFACE
 * Mock Tests placeholder page.
 */
export default function MockTestsPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Mock Tests</h1>
          <div className="muted">
            Placeholder for tests list and take flow. Will use{" "}
            <code>GET /tests</code> and <code>GET /tests/:id</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
