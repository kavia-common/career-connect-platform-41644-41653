import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/authStore";
import { useNotificationsStore } from "../state/notificationsStore";
import { loadNotifications } from "../utils/notificationsStorage";
import { loadApplications } from "../utils/applicationsStorage";
import { jobsData } from "../data/jobsData";
import { challenges } from "../data/challengesData";
import RecentNotificationsPanel from "../components/RecentNotificationsPanel";

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
    return list.slice(0, 6);
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

  const [savedJobIds, setSavedJobIds] = useState(() => new Set());

  function toggleSave(jobId) {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  }

  function getCompanyInitials(companyName) {
    const raw = String(companyName || "").trim();
    if (!raw) return "CO";
    const parts = raw.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "C";
    const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
    const initials = `${first}${second || ""}`.toUpperCase();
    return initials.slice(0, 2);
  }

  function formatJobType(job) {
    const jt = String(job?.jobType ?? job?.type ?? "").toLowerCase().trim();
    if (jt.includes("remote")) return "Remote";
    if (jt.includes("hybrid")) return "Hybrid";
    if (jt.includes("full")) return "Full-time";
    if (jt.includes("part")) return "Part-time";
    if (jt.includes("contract")) return "Contract";
    return jt ? jt.charAt(0).toUpperCase() + jt.slice(1) : "Full-time";
  }

  function formatSalary(job) {
    // Prefer explicit formatted field if present (some datasets might use `salary`)
    if (job?.salary) return String(job.salary);

    const min = job?.salaryMin;
    const max = job?.salaryMax;
    const currency = String(job?.currency || "").trim();

    if (min === undefined && max === undefined) return "Competitive";

    const isHourly = typeof min === "number" && min < 1000; // heuristic for mock dataset
    const fmt = (n) =>
      typeof n === "number"
        ? isHourly
          ? n.toFixed(0)
          : new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)
        : "—";

    const prefix = currency ? `${currency} ` : "";
    const range = `${fmt(min)} – ${fmt(max)}`;
    return isHourly ? `${prefix}${range} / hr` : `${prefix}${range}`;
  }

  const handleViewAllNotifications = () => {
    navigate("/notifications");
  };

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
            <button className="btn btn-secondary" onClick={() => navigate("/jobs")}>
              Explore jobs
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/ai-matching")}>
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
              <div className="rec-jobs">
                {recommendedJobs.length === 0 ? (
                  <div className="muted">
                    No recommendations yet. Try AI Job Matching to generate matches.
                  </div>
                ) : (
                  <div className="rec-jobs-grid" aria-label="Recommended job cards">
                    {recommendedJobs.map((job) => {
                      const id = String(job?.id ?? job?._id ?? job?.jobId ?? "");
                      const title = job?.title || "Role";
                      const company = job?.company || "Company";
                      const location = job?.location || "Location";
                      const salary = formatSalary(job);
                      const jobTypeText = formatJobType(job);
                      const initials = getCompanyInitials(company);
                      const isSaved = id && savedJobIds.has(id);

                      return (
                        <div key={id || `${title}-${company}`} className="rec-job-card">
                          <div className="rec-job-top">
                            <div className="rec-job-main">
                              {/* Logo: if missing, render a placeholder avatar with initials */}
                              <div className="rec-company-avatar" aria-label={`${company} logo`}>
                                {initials}
                              </div>

                              <div style={{ minWidth: 0 }}>
                                <div className="rec-job-title" title={title}>
                                  {title}
                                </div>
                                <div className="rec-job-company">
                                  <span>{company}</span>
                                </div>
                                <div className="rec-job-meta">
                                  <span>{location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="rec-job-actions">
                              <button
                                type="button"
                                className="icon-btn-sm"
                                aria-label={isSaved ? "Unsave job" : "Save job"}
                                aria-pressed={isSaved}
                                onClick={() => (id ? toggleSave(id) : null)}
                                disabled={!id}
                                title={isSaved ? "Saved" : "Save"}
                              >
                                {isSaved ? "★" : "☆"}
                              </button>

                              {job?.applyUrl ? (
                                <a
                                  className="btn btn-primary"
                                  href={job.applyUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`Apply to ${title} at ${company}`}
                                >
                                  Apply
                                </a>
                              ) : (
                                <button
                                  className="btn btn-primary"
                                  disabled
                                  aria-label="Apply disabled (no apply URL in mock data)"
                                  title="No apply URL available"
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="rec-job-tags" aria-label="Job attributes">
                            <span className="tag primary">{jobTypeText}</span>
                            <span className="tag">{salary}</span>
                            {job?.seniority ? (
                              <span className="tag">
                                {String(job.seniority).charAt(0).toUpperCase() +
                                  String(job.seniority).slice(1)}
                              </span>
                            ) : null}
                          </div>

                          <div className="rec-job-footer">
                            {id ? (
                              <Link className="btn btn-secondary rec-job-details-link" to={`/jobs/${encodeURIComponent(id)}`}>
                                View details
                              </Link>
                            ) : (
                              <span className="muted" style={{ fontSize: 13 }}>
                                Details unavailable
                              </span>
                            )}

                            <span className="muted" style={{ fontSize: 12 }}>
                              Recommended for you
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>
                “Apply” opens the mock job apply URL in a new tab; “Save” is a local
                UI-only toggle for now.
              </div>
            </div>
          </div>

          {/* Right rail: Recent Notifications + Challenges + AI Mentor */}
          <div style={{ display: "grid", gap: 12 }}>
            {/* Recent Notifications Panel */}
            <RecentNotificationsPanel onViewAll={handleViewAllNotifications} />

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
                    Update your headline and add 3 quantified achievements to improve
                    recruiter response rate.
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button className="btn btn-primary" onClick={() => navigate("/profile")}>
                      Update profile
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate("/mentor")}>
                      Ask mentor
                    </button>
                  </div>
                </div>

                <div className="muted" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.4 }}>
                  Mentor responses are currently powered by local templates; hook up to backend/LLM when ready.
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="muted" style={{ fontSize: 12 }}>
          Tip: Use <strong>AI Match Now</strong> to generate tailored recommendations based on your profile.
        </div>
      </div>
    </div>
  );
}
