import React from "react";
import { useAuth } from "../state/authStore";

/**
 * PUBLIC_INTERFACE
 * DashboardPage: minimal MVP dashboard placeholder.
 */
export default function DashboardPage() {
  const auth = useAuth();
  const name =
    auth.user?.user_metadata?.fullName ||
    auth.user?.user_metadata?.name ||
    auth.user?.email ||
    "there";

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 10 }}>
          <h1 className="h1">Dashboard</h1>
          <div className="muted">Welcome, {name}.</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 6,
            }}
          >
            <div className="card">
              <div className="card-body">
                <div className="h2">Recommended Jobs</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Placeholder. Will be powered by <code>POST /ai/match</code>.
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="h2">Applications</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Placeholder. Will use <code>/applications</code>.
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="h2">Notifications</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Placeholder. Will use <code>/notifications</code>.
                </div>
              </div>
            </div>
          </div>

          <div className="muted" style={{ fontSize: 13 }}>
            Authenticated as: <code>{auth.user?.email}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
