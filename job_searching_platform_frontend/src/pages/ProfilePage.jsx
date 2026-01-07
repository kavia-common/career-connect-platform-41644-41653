import React from "react";
import { skillProfileData } from "../data/skillProfileData";

/**
 * PUBLIC_INTERFACE
 * Profile page rendering a skill-based profile using a static local dataset.
 *
 * This page intentionally does NOT call Supabase or backend APIs yet; it consumes
 * `skillProfileData` as the current source of truth for the UI.
 */
export default function ProfilePage() {
  const profile = skillProfileData;

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1" style={{ marginBottom: 2 }}>
              {profile?.name ?? "Profile"}
            </h1>

            <div className="muted" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {profile?.role ? <span>{profile.role}</span> : null}
              {profile?.role && profile?.experience ? (
                <span aria-hidden="true" style={{ opacity: 0.6 }}>
                  •
                </span>
              ) : null}
              {profile?.experience ? <span>{profile.experience}</span> : null}
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: "var(--color-border)",
              margin: "2px 0 0",
            }}
          />

          <section style={{ display: "grid", gap: 10 }}>
            <h2 className="h2">Skills</h2>

            {Array.isArray(profile?.skills) && profile.skills.length > 0 ? (
              <div style={{ display: "grid", gap: 8 }}>
                {profile.skills.map((s, idx) => (
                  <div
                    key={`${s?.name ?? "skill"}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 12px",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      background: "var(--color-surface)",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{s?.name ?? "Skill"}</div>
                    <div className="muted" style={{ fontWeight: 600 }}>
                      {s?.level ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="muted">No skills added yet.</div>
            )}
          </section>

          <section style={{ display: "grid", gap: 10 }}>
            <h2 className="h2">Interests</h2>

            {Array.isArray(profile?.interests) && profile.interests.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile.interests.map((interest, idx) => (
                  <span
                    key={`${interest}-${idx}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid var(--color-border)",
                      background: "rgba(55, 65, 81, 0.06)",
                      color: "var(--color-text)",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <div className="muted">No interests added yet.</div>
            )}
          </section>

          <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>
            Data source: <code>src/data/skillProfileData.js</code> (static)
          </div>
        </div>
      </div>
    </div>
  );
}
