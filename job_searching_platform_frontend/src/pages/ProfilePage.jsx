import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../state/authStore";
import { loadProfile, saveProfile } from "../utils/profileStorage";

/**
 * PUBLIC_INTERFACE
 * ProfilePage: user-editable profile page backed by localStorage (temporary).
 */
export default function ProfilePage() {
  const auth = useAuth();

  const defaultProfile = useMemo(() => {
    const fullName =
      auth.user?.user_metadata?.fullName ||
      auth.user?.user_metadata?.name ||
      "";

    return {
      fullName,
      headline: "",
      location: "",
      phone: "",
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
  const [status, setStatus] = useState({ type: "idle", message: "" });

  // Load from local storage on mount.
  useEffect(() => {
    const stored = loadProfile();
    if (stored) {
      // Remove deprecated fields from older stored profiles.
      // This keeps storage forward-compatible and avoids persisting removed fields.
      // eslint-disable-next-line no-unused-vars
      const { website, ...storedWithoutWebsite } = stored;

      // Merge defaults + stored to keep forward-compatible shape.
      setProfile((prev) => ({
        ...prev,
        ...storedWithoutWebsite,
        links: { ...prev.links, ...(storedWithoutWebsite.links || {}) },
        preferences: {
          ...prev.preferences,
          ...(storedWithoutWebsite.preferences || {}),
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-persist (debounced-ish) whenever profile changes.
  useEffect(() => {
    const t = window.setTimeout(() => {
      saveProfile(profile);
    }, 250);
    return () => window.clearTimeout(t);
  }, [profile]);

  const onChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setProfile((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const onChangeNested = useCallback((path, value) => {
    // path like: "links.linkedin" or "preferences.desiredRole"
    const [root, key] = path.split(".");
    setProfile((p) => ({
      ...p,
      [root]: {
        ...(p[root] || {}),
        [key]: value,
      },
    }));
  }, []);

  const addSkill = useCallback(() => {
    setProfile((p) => {
      const next = String(p._skillDraft || "").trim();
      if (!next) return p;
      if (p.skills?.some((s) => s.toLowerCase() === next.toLowerCase())) {
        return { ...p, _skillDraft: "" };
      }
      return { ...p, skills: [...(p.skills || []), next], _skillDraft: "" };
    });
  }, []);

  const removeSkill = useCallback((skill) => {
    setProfile((p) => ({
      ...p,
      skills: (p.skills || []).filter((s) => s !== skill),
    }));
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const ok = saveProfile(profile);
      setStatus(
        ok
          ? { type: "success", message: "Profile saved locally." }
          : { type: "error", message: "Could not save profile to local storage." }
      );
      window.setTimeout(() => setStatus({ type: "idle", message: "" }), 2500);
    },
    [profile]
  );

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <h1 className="h1">Profile</h1>
            <div className="muted" style={{ fontSize: 13 }}>
              Stored locally for now. Signed in as <code>{auth.user?.email}</code>.
            </div>
          </div>

          {status.type !== "idle" ? (
            <div
              className="card"
              role="status"
              aria-live="polite"
              style={{
                borderColor:
                  status.type === "success"
                    ? "rgba(5, 150, 105, 0.35)"
                    : "rgba(220, 38, 38, 0.35)",
                background:
                  status.type === "success"
                    ? "rgba(5, 150, 105, 0.06)"
                    : "rgba(220, 38, 38, 0.06)",
              }}
            >
              <div className="card-body" style={{ padding: 12 }}>
                {status.message}
              </div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
            <section className="card">
              <div className="card-body" style={{ display: "grid", gap: 12 }}>
                <div className="h2">Basic details</div>

                <div className="form-row">
                  <label className="label" htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    className="input"
                    value={profile.fullName || ""}
                    onChange={onChange}
                    autoComplete="name"
                  />
                </div>

                <div className="form-row">
                  <label className="label" htmlFor="headline">
                    Headline
                  </label>
                  <input
                    id="headline"
                    name="headline"
                    className="input"
                    placeholder="e.g., Frontend Engineer • React • UI Systems"
                    value={profile.headline || ""}
                    onChange={onChange}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="location">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      className="input"
                      placeholder="City, Country"
                      value={profile.location || ""}
                      onChange={onChange}
                    />
                  </div>

                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      className="input"
                      value={profile.phone || ""}
                      onChange={onChange}
                      autoComplete="tel"
                    />
                  </div>


                </div>

                <div className="form-row">
                  <label className="label" htmlFor="summary">
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    className="textarea"
                    rows={5}
                    placeholder="A short professional summary..."
                    value={profile.summary || ""}
                    onChange={onChange}
                  />
                </div>
              </div>
            </section>

            <section className="card">
              <div className="card-body" style={{ display: "grid", gap: 12 }}>
                <div className="h2">Skills</div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    className="input"
                    placeholder="Add a skill (e.g., React)"
                    value={profile._skillDraft || ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, _skillDraft: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    aria-label="Skill to add"
                  />
                  <button type="button" className="btn btn-secondary" onClick={addSkill}>
                    Add
                  </button>
                </div>

                {(profile.skills || []).length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(profile.skills || []).map((skill) => (
                      <span
                        key={skill}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 10px",
                          borderRadius: 999,
                          border: "1px solid var(--color-border)",
                          background: "rgba(55, 65, 81, 0.04)",
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{skill}</span>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => removeSkill(skill)}
                          style={{ padding: "4px 8px", borderRadius: 999 }}
                          aria-label={`Remove skill ${skill}`}
                        >
                          Remove
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="muted" style={{ fontSize: 13 }}>
                    Add a few skills to improve matching and recommendations.
                  </div>
                )}
              </div>
            </section>

            <section className="card">
              <div className="card-body" style={{ display: "grid", gap: 12 }}>
                <div className="h2">Links</div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="linkedin">
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      className="input"
                      value={profile.links?.linkedin || ""}
                      onChange={(e) => onChangeNested("links.linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="github">
                      GitHub
                    </label>
                    <input
                      id="github"
                      className="input"
                      value={profile.links?.github || ""}
                      onChange={(e) => onChangeNested("links.github", e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="portfolio">
                      Portfolio
                    </label>
                    <input
                      id="portfolio"
                      className="input"
                      value={profile.links?.portfolio || ""}
                      onChange={(e) => onChangeNested("links.portfolio", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="card">
              <div className="card-body" style={{ display: "grid", gap: 12 }}>
                <div className="h2">Preferences</div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label" htmlFor="desiredRole">
                      Desired role
                    </label>
                    <input
                      id="desiredRole"
                      className="input"
                      value={profile.preferences?.desiredRole || ""}
                      onChange={(e) =>
                        onChangeNested("preferences.desiredRole", e.target.value)
                      }
                      placeholder="e.g., Product Designer"
                    />
                  </div>

                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="label">Work style</label>
                    <div style={{ display: "grid", gap: 8 }}>
                      <label
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          userSelect: "none",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!profile.preferences?.openToRemote}
                          onChange={(e) =>
                            onChangeNested("preferences.openToRemote", e.target.checked)
                          }
                        />
                        <span>Open to remote</span>
                      </label>
                      <label
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          userSelect: "none",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!profile.preferences?.openToRelocation}
                          onChange={(e) =>
                            onChangeNested(
                              "preferences.openToRelocation",
                              e.target.checked
                            )
                          }
                        />
                        <span>Open to relocation</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
