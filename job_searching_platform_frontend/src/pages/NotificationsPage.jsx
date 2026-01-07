import React from "react";

/**
 * PUBLIC_INTERFACE
 * Notifications placeholder page.
 */
export default function NotificationsPage() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Notifications</h1>
          <div className="muted">
            Placeholder for notification center. Will use{" "}
            <code>GET /notifications</code> and{" "}
            <code>POST /notifications/mark-read</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
