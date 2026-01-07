import React from "react";

/**
 * PUBLIC_INTERFACE
 * Application Tracking placeholder page.
 */
export default function ApplicationsPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Application Tracking</h1>
          <div className="muted">
            Placeholder for application list & timeline. Will use{" "}
            <code>GET /applications</code> and{" "}
            <code>GET /applications/:id/timeline</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
