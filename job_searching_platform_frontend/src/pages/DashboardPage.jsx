import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/authStore";
import { useNotificationsStore } from "../state/notificationsStore";
import { loadNotifications } from "../utils/notificationsStorage";
import { loadApplications } from "../utils/applicationsStorage";
import { jobsData } from "../data/jobsData";
import { challenges } from "../data/challengesData";

/**
 * PUBLIC_INTERFACE
 * DashboardPage: Modern Talenvia dashboard with KPI cards, recommended jobs,
 * notifications, and gamified challenges.
 *
 * Notes:
 * - Uses local mock data already present in src/data for an offline-friendly UI.
 * - API integration can progressively replace the mocked KPI values and lists.
 */
export default function DashboardPage() {
  const auth = useAuth();
  const { unreadCount } = useNotificationsStore();
  const navigate = useNavigate();

  const authName =
    auth.user?.user_metadata?.fullName ||
    auth.user?.user_metadata?.name ||
    auth.user?.email ||
    "there";

  const notifications = useMemo(() => {
    // Keep the dashboard “alive” by showing latest notifications from local storage.
    const all = loadNotifications();
    return (all || []).slice(0, 5);
  }, []);

  const recommendedJobs = useMemo(() => {
    const list = Array.isArray(jobsData) ? jobsData : [];
    return list.slice(0, 5);
  }, []);

  const challengesList = useMemo(() => {
    const list = Array.isArray(challenges) ? challenges : [];
    return list.slice(0, 4);
  }, []);

  const applications = useMemo(() => loadApplications(), []);
  const activeApplicationsCount = useMemo(() => {
    // “Active” = not in terminal states; this is heuristic for a mock UI.
    const activeStatuses = new Set(["rejected", "withdrawn", "offer declined"]);
    return (applications ?? []).filter((a) => {
      const status = String(a?.status ?? "").trim().toLowerCase();
      if (!status) return true;
      return !activeStatuses.has(status);
    }).length;
  }, [applications]);

  const jobMatchesCount = useMemo(() => {
    // Placeholder “new matches”: use the size of local dataset as a proxy for now.
    // When AI matching is implemented, this should use the matching engine output.
    return Math.min(Array.isArray(jobsData) ? jobsData.length : 0, 24);
  }, []);

  const skillScore = useMemo(() => {
    // Placeholder skill score; can later come from profile analysis.
    return { pct: 86, skill: "React" };
  }, []);

  const kpis = useMemo(() => {
    return [
      {
        label: "Job Matches",
        value: String(jobMatchesCount),
        sub: "New matches",
        icon: "🔎",
      },
      {
        label: "Applications",
        value: String(activeApplicationsCount),
        sub: "Active",
        icon: "📄",
      },
      {
        label: "Notifications",
        value: String(unreadCount || 0),
        sub: "Unread",
        icon: "🔔",
      },
      {
        label: "Skill Score",
        value: `${skillScore.pct}%`,
        sub: skillScore.skill,
        icon: "🎯",
      },
    ];
  }, [activeApplicationsCount, jobMatchesCount, skillScore.pct, skillScore.skill, unreadCount]);

  return (
    <div className="container">
      <div className="page" style={{ paddingBottom: 16 }}>
        {/* Header */}
        <div className="page-header">
          <div className="page-title">
            <h1 className="h1">Welcome back, {authName}</h1>
            <div className="muted">
              Track your progress, discover opportunities, and level up with AI.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/jobs")}
            >
              Explore jobs
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/ai-matching")}
            >
              AI Match Now
            </button>
          </div>
        </div>

        {/* KPI cards (compact) */}
        <section className="kpi-grid compact" aria-label="Key performance indicators">
          {kpis.map((k) => (
            <div key={k.label} className="kpi-card compact">
              <div className="kpi-row">
                <div className="kpi-icon" aria-hidden="true">
                  {k.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-value">{k.value}</div>
                  <div className="kpi-sub">{k.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Main grid: Recommended jobs + right rail */}
        <section className="dashboard-grid" aria-label="Dashboard content">
          {/* Recommended Jobs */}
          <div className="panel" role="region" aria-label="Recommended jobs">
            <div className="panel-header">
              <div style={{ display: "grid", gap: 2 }}>
                <div className="panel-title">Recommended jobs</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  Curated roles aligned to your profile
                </div>
              </div>
              <Link className="btn btn-secondary" to="/jobs">
                View all
              </Link>
            </div>

            <div className="panel-body">
              <div className="list">
                {recommendedJobs.length === 0 ? (
                  <div className="muted">
                    No recommendations yet. Try AI Job Matching to generate
                    matches.
                  </div>
                ) : (
                  recommendedJobs.map((job) => {
                    const title = job?.title || "Role";
                    const company = job?.company || "Company";
                    const location = job?.location || "Location";
                    const type = job?.type || "Full-time";
                    const salary = job?.salary || "Competitive";
                    const id = job?.id ?? job?._id ?? job?.jobId;

                    return (
                      <div
                        key={`${title}-${company}-${String(id ?? "")}`}
                        className="list-item"
                      >
                        <div className="item-top">
                          <div style={{ display: "grid", gap: 4 }}>
                            <div className="item-title">{title}</div>
                            <div className="item-meta">
                              <span>{company}</span>
                              <span>•</span>
                              <span>{location}</span>
                              <span>•</span>
                              <span>{type}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: 8 }}>
                            {id ? (
                              <Link
                                className="btn btn-secondary"
                                to={`/jobs/${id}`}
                              >
                                Details
                              </Link>
                            ) : null}
                            <button className="btn btn-primary" disabled>
                              Apply
                            </button>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span className="tag primary">AI match</span>
                          <span className="tag">{salary}</span>
                          {job?.experience ? (
                            <span className="tag">{job.experience}</span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>
                Applying is disabled in this UI-only iteration; wire to existing
                applications flow later.
              </div>
            </div>
          </div>

          {/* Right rail: Notifications + Challenges + AI Mentor */}
          <div style={{ display: "grid", gap: 12 }}>
            {/* Notifications */}
            <div
              className="panel"
              role="region"
              aria-label="Latest notifications"
            >
              <div className="panel-header">
                <div style={{ display: "grid", gap: 2 }}>
                  <div className="panel-title">Notifications</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  </div>
                </div>
                <Link className="btn btn-secondary" to="/notifications">
                  Open
                </Link>
              </div>
              <div className="panel-body">
                <div className="list">
                  {notifications.length === 0 ? (
                    <div className="muted">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id || n.createdAt || n.title}
                        className="list-item"
                      >
                        <div className="item-top">
                          <div style={{ display: "grid", gap: 4 }}>
                            <div className="item-title">
                              {n.title || "Update"}
                            </div>
                            <div className="muted" style={{ fontSize: 13 }}>
                              {n.message || n.body || "—"}
                            </div>
                          </div>
                          {n.read ? (
                            <span className="tag">Read</span>
                          ) : (
                            <span className="tag primary">New</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Gamified Challenges */}
            <div className="panel" role="region" aria-label="Challenges">
              <div className="panel-header">
                <div style={{ display: "grid", gap: 2 }}>
                  <div className="panel-title">Gamified challenges</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Earn points by completing career quests
                  </div>
                </div>
                <Link className="btn btn-secondary" to="/challenges">
                  View
                </Link>
              </div>
              <div className="panel-body">
                <div className="list">
                  {challengesList.length === 0 ? (
                    <div className="muted">No challenges available.</div>
                  ) : (
                    challengesList.map((c) => {
                      const title = c?.title || "Challenge";
                      const description = c?.description || "—";
                      const points = c?.points ?? c?.rewardPoints ?? 0;

                      // Normalize a "progress" % across different mock shapes
                      const progressPct =
                        typeof c?.progress === "number"
                          ? Math.max(0, Math.min(100, c.progress))
                          : typeof c?.completion === "number"
                            ? Math.max(0, Math.min(100, c.completion))
                            : c?.completed
                              ? 100
                              : 45;

                      return (
                        <div key={c.id || title} className="list-item">
                          <div className="item-top">
                            <div style={{ display: "grid", gap: 4 }}>
                              <div className="item-title">{title}</div>
                              <div className="muted" style={{ fontSize: 13 }}>
                                {description}
                              </div>
                            </div>
                            <span className="tag primary">+{points} pts</span>
                          </div>

                          <div style={{ display: "grid", gap: 8 }}>
                            <div className="progress" aria-label="Progress">
                              <div style={{ width: `${progressPct}%` }} />
                            </div>
                            <div
                              className="muted"
                              style={{
                                fontSize: 12,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{progressPct}% complete</span>
                              <span>Streak bonus: coming soon</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* AI Mentor */}
            <div className="panel" role="region" aria-label="AI mentor">
              <div className="panel-header">
                <div style={{ display: "grid", gap: 2 }}>
                  <div className="panel-title">AI Career Mentor</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Ask anything: resume, interviews, strategy
                  </div>
                </div>
                <Link className="btn btn-secondary" to="/mentor">
                  Chat
                </Link>
              </div>
              <div className="panel-body">
                <div className="list-item">
                  <div className="item-title">Today’s suggestion</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Update your headline and add 3 quantified achievements to
                    improve recruiter response rate.
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/profile")}
                    >
                      Update profile
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate("/mentor")}
                    >
                      Ask mentor
                    </button>
                  </div>
                </div>

                <div
                  className="muted"
                  style={{ fontSize: 12, marginTop: 10, lineHeight: 1.4 }}
                >
                  Mentor responses are currently powered by local templates; hook
                  up to backend/LLM when ready.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="muted" style={{ fontSize: 12 }}>
          Tip: Use <strong>AI Match Now</strong> to generate tailored
          recommendations based on your profile.
        </div>
      </div>
    </div>
  );
}
