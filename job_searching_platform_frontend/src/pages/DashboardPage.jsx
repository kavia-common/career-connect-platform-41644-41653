import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/authStore";
import { loadProfile } from "../utils/profileStorage";

/**
 * PUBLIC_INTERFACE
 * DashboardPage: minimal MVP dashboard placeholder with a compact profile summary.
 */
export default function DashboardPage() {
  const auth = useAuth();

  const authName =
    auth.user?.user_metadata?.fullName ||
    auth.user?.user_metadata?.name ||
    auth.user?.email ||
    "there";

  // Keep the same shape as ProfilePage so the dashboard summary stays compatible.
  const defaultProfile = useMemo(() => {
    const fullName =
      auth.user?.user_metadata?.fullName || auth.user?.user_metadata?.name || "";

    return {
      fullName,
      headline: "",
      location: "",
      phone: "",
      website: "",
      summary: "",
      skills: [], // array of strings
      links: {
        linkedin: "",
        github: "",
        portfolio: "",
      },
      preferences: {
        openToRemote: true,
        openToRelocation: false,
        desiredRole: "",
      },
    };
  }, [auth.user]);

  const [profile, setProfile] = useState(defaultProfile);

  // Load stored profile (localStorage-backed) once on mount.
  useEffect(() => {
    const stored = loadProfile();
    if (stored) {
      // Merge defaults + stored to keep forward-compatible shape.
      setProfile((prev) => ({
        ...prev,
        ...stored,
        links: { ...prev.links, ...(stored.links || {}) },
        preferences: { ...prev.preferences, ...(stored.preferences || {}) },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = profile.fullName?.trim() || authName;

  const roleText =
    profile.preferences?.desiredRole?.trim() ||
    profile.headline?.trim() ||
    "Add your desired role to improve matching";

  const experienceText = profile.location?.trim() || "Add location / experience details";

  const topSkills = (profile.skills || []).slice(0, 6);

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <h1 className="h1">Dashboard</h1>
          <div className="muted">Welcome, {authName}.</div>

          {/* Compact Profile Section */}
          <section className="card" aria-label="Profile summary">
            <div className="card-body" style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="h2" style={{ margin: 0 }}>
                      {displayName}
                    </div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {roleText}
                    </div>
                  </div>

                  <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                    {experienceText}
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="btn btn-secondary"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Edit Profile
                </Link>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.2 }}>
                  TOP SKILLS / INTERESTS
                </div>

                {topSkills.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {topSkills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "6px 10px",
                          borderRadius: 999,
                          border: "1px solid var(--color-border)",
                          background: "rgba(55, 65, 81, 0.04)",
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: 13 }}>
                    Add a few skills in your profile to personalize recommendations.
                  </div>
                )}
              </div>

              <div className="muted" style={{ fontSize: 12 }}>
                Tip: keep your role and skills updated for better AI matching.
              </div>
            </div>
          </section>

          {/* Existing Dashboard widgets below */}
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
