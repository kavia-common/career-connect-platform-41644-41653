import React, { useEffect, useMemo, useState } from "react";
import {
  loadApplications,
  saveApplications,
  updateApplicationStatus,
  upsertTimelineEvent,
  resetApplications,
} from "../utils/applicationsStorage";

/**
 * Normalize a value to a search-friendly lowercase string.
 * @param {unknown} value
 */
function toSearchText(value) {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
}

/**
 * Attempt to parse an ISO date string to epoch millis.
 * Returns NaN when invalid.
 * @param {string} iso
 */
function toTime(iso) {
  if (!iso) return Number.NaN;
  const t = Date.parse(String(iso));
  return Number.isFinite(t) ? t : Number.NaN;
}

function uniqStrings(values) {
  const out = [];
  const seen = new Set();
  for (const v of values) {
    const s = String(v || "").trim();
    if (!s) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatEventDate(value) {
  const t = Date.parse(String(value || ""));
  if (!Number.isFinite(t)) return String(value || "—");
  return new Date(t).toLocaleDateString();
}

const COMMON_STATUS_OPTIONS = [
  "Applied",
  "Interview Scheduled",
  "Interviewing",
  "Offer",
  "Rejected",
  "Withdrawn",
];

/**
 * PUBLIC_INTERFACE
 * ApplicationsPage: local application tracking view backed by static applicationsData
 * with localStorage persistence for status + timeline.
 *
 * Includes basic filters and sorting for status/date/company/title.
 */
export default function ApplicationsPage() {
  const [applications, setApplications] = useState(() => loadApplications());

  // Persist any changes (best-effort).
  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  // UI state: expand/collapse timeline per application
  const [expandedById, setExpandedById] = useState({});

  // UI state: status editing per application
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [draftStatusById, setDraftStatusById] = useState({});

  // UI state: add timeline event form per application
  const [timelineDraftById, setTimelineDraftById] = useState({});

  const statusOptions = useMemo(() => {
    const statuses = applications.map((a) => a.status).filter(Boolean);
    const derived = uniqStrings(statuses);

    // Keep the dropdown stable and useful by prioritizing common statuses first.
    const normalizedCommon = COMMON_STATUS_OPTIONS.filter((s) =>
      derived.some((d) => d.toLowerCase() === s.toLowerCase())
    );

    const rest = derived
      .filter(
        (s) =>
          !COMMON_STATUS_OPTIONS.some((c) => c.toLowerCase() === s.toLowerCase())
      )
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    const combined = uniqStrings([...normalizedCommon, ...rest]);
    return combined;
  }, [applications]);

  const filtered = useMemo(() => {
    const q = toSearchText(query).trim();
    const s = toSearchText(statusFilter);

    return applications.filter((app) => {
      if (q) {
        const haystack = [
          app.jobTitle,
          app.company,
          app.status,
          app.appliedDate,
          ...(Array.isArray(app.timeline)
            ? app.timeline.flatMap((e) => [e.type, e.note, e.date])
            : []),
        ]
          .map(toSearchText)
          .join(" • ");

        if (!haystack.includes(q)) return false;
      }

      if (s && s !== "all") {
        if (toSearchText(app.status) !== s) return false;
      }

      return true;
    });
  }, [applications, query, statusFilter]);

  const sorted = useMemo(() => {
    const base = [...filtered];

    const cmpText = (a, b) =>
      toSearchText(a || "").localeCompare(toSearchText(b || ""));

    switch (sortBy) {
      case "date_asc":
        base.sort((a, b) => {
          const ta = toTime(a.appliedDate);
          const tb = toTime(b.appliedDate);
          if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
          if (Number.isNaN(ta)) return 1;
          if (Number.isNaN(tb)) return -1;
          return ta - tb;
        });
        break;
      case "company_asc":
        base.sort((a, b) => cmpText(a.company, b.company));
        break;
      case "title_asc":
        base.sort((a, b) => cmpText(a.jobTitle, b.jobTitle));
        break;
      case "status_asc":
        base.sort((a, b) => cmpText(a.status, b.status));
        break;
      case "date_desc":
      default:
        base.sort((a, b) => {
          const ta = toTime(a.appliedDate);
          const tb = toTime(b.appliedDate);
          if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
          if (Number.isNaN(ta)) return 1;
          if (Number.isNaN(tb)) return -1;
          return tb - ta;
        });
        break;
    }

    return base;
  }, [filtered, sortBy]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (String(query || "").trim()) n += 1;
    if (String(statusFilter || "").trim() && statusFilter !== "all") n += 1;
    return n;
  }, [query, statusFilter]);

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
  }

  const statusBadgeStyle = (status) => {
    const s = toSearchText(status);
    const base = {
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid var(--color-border)",
      background: "rgba(55, 65, 81, 0.04)",
      fontSize: 13,
      fontWeight: 700,
      width: "fit-content",
    };

    if (s.includes("interview")) {
      return {
        ...base,
        borderColor: "rgba(5, 150, 105, 0.35)",
        background: "rgba(5, 150, 105, 0.10)",
      };
    }
    if (s.includes("rejected")) {
      return {
        ...base,
        borderColor: "rgba(220, 38, 38, 0.35)",
        background: "rgba(220, 38, 38, 0.08)",
      };
    }
    if (s.includes("offer")) {
      return {
        ...base,
        borderColor: "rgba(55, 65, 81, 0.35)",
        background: "rgba(55, 65, 81, 0.12)",
      };
    }
    return base;
  };

  function toggleExpanded(id) {
    setExpandedById((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  }

  function beginEditStatus(app) {
    setEditingStatusId(app.id);
    setDraftStatusById((prev) => ({
      ...prev,
      [String(app.id)]: String(app.status || "").trim(),
    }));
  }

  function cancelEditStatus() {
    setEditingStatusId(null);
  }

  function saveStatus(appId) {
    const nextStatus = String(draftStatusById[String(appId)] || "").trim();
    if (!nextStatus) return;

    setApplications((prev) =>
      updateApplicationStatus(prev, appId, nextStatus, { date: isoToday() })
    );
    setEditingStatusId(null);
    // If timeline panel isn't expanded, still give users a hint by expanding after status change.
    setExpandedById((prev) => ({ ...prev, [String(appId)]: true }));
  }

  function setTimelineDraft(appId, patch) {
    setTimelineDraftById((prev) => ({
      ...prev,
      [String(appId)]: { ...(prev[String(appId)] || {}), ...patch },
    }));
  }

  function addTimelineEvent(appId) {
    const draft = timelineDraftById[String(appId)] || {};
    const type = String(draft.type || "").trim();
    const note = String(draft.note || "").trim();
    const date = String(draft.date || "").trim() || isoToday();

    if (!type) return;

    setApplications((prev) =>
      upsertTimelineEvent(prev, appId, { type, note, date })
    );

    // Clear per-app draft (keep date convenience as "today").
    setTimelineDraftById((prev) => ({
      ...prev,
      [String(appId)]: { date: isoToday(), type: "", note: "" },
    }));

    setExpandedById((prev) => ({ ...prev, [String(appId)]: true }));
  }

  function resetLocalEdits() {
    resetApplications();
    setApplications(loadApplications());
    setEditingStatusId(null);
    setDraftStatusById({});
    setTimelineDraftById({});
    setExpandedById({});
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1">Application Tracking</h1>
            <div className="muted">
              Track your applications by <strong>company</strong>,{" "}
              <strong>job title</strong>, <strong>applied date</strong>, and{" "}
              <strong>status</strong>. You can also add{" "}
              <strong>timeline events</strong> per application.
            </div>
          </div>

          {/* Controls */}
          <div className="card" style={{ background: "rgba(55, 65, 81, 0.03)" }}>
            <div className="card-body" style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: 12,
                  alignItems: "end",
                }}
              >
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="apps-q">
                    Search
                  </label>
                  <input
                    id="apps-q"
                    className="input"
                    type="text"
                    placeholder="Search by title, company, status, timeline…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="apps-status">
                    Status
                  </label>
                  <select
                    id="apps-status"
                    className="select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="apps-sort">
                    Sort by
                  </label>
                  <select
                    id="apps-sort"
                    className="select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date_desc">Applied date (newest)</option>
                    <option value="date_asc">Applied date (oldest)</option>
                    <option value="company_asc">Company (A–Z)</option>
                    <option value="title_asc">Job title (A–Z)</option>
                    <option value="status_asc">Status (A–Z)</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="muted" style={{ fontSize: 13 }}>
                  Showing <strong>{sorted.length}</strong> of{" "}
                  <strong>{applications.length}</strong>
                  {activeFilterCount ? (
                    <>
                      {" "}
                      • Filters: <strong>{activeFilterCount}</strong>
                    </>
                  ) : null}
                  .
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={clearFilters}
                    disabled={!activeFilterCount}
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetLocalEdits}
                    title="Clears locally saved edits and returns to the static seed data"
                  >
                    Reset local edits
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {sorted.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="h2">No applications found</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Try clearing filters or searching for a different company/title.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {sorted.map((app) => {
                const isExpanded = Boolean(expandedById[String(app.id)]);
                const isEditingStatus = editingStatusId === app.id;

                const timeline = Array.isArray(app.timeline) ? app.timeline : [];
                const timelineDraft = timelineDraftById[String(app.id)] || {
                  date: isoToday(),
                  type: "",
                  note: "",
                };

                return (
                  <div className="card" key={app.id}>
                    <div className="card-body" style={{ display: "grid", gap: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          alignItems: "baseline",
                        }}
                      >
                        <div style={{ display: "grid", gap: 4, minWidth: 260 }}>
                          <div className="h2">{app.jobTitle}</div>
                          <div className="muted">
                            {app.company}
                            {app.appliedDate ? ` • Applied ${app.appliedDate}` : ""}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                          }}
                        >
                          {!isEditingStatus ? (
                            <>
                              <span style={statusBadgeStyle(app.status)}>
                                {app.status}
                              </span>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => beginEditStatus(app)}
                              >
                                Edit status
                              </button>
                            </>
                          ) : (
                            <div
                              className="card"
                              style={{
                                borderRadius: 10,
                                padding: 10,
                                background: "rgba(55, 65, 81, 0.03)",
                              }}
                            >
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr",
                                  gap: 8,
                                  minWidth: 260,
                                }}
                              >
                                <label
                                  className="muted"
                                  htmlFor={`status-edit-${app.id}`}
                                  style={{ fontSize: 13, fontWeight: 700 }}
                                >
                                  Update status
                                </label>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <select
                                    id={`status-edit-${app.id}`}
                                    className="select"
                                    value={draftStatusById[String(app.id)] ?? app.status}
                                    onChange={(e) =>
                                      setDraftStatusById((prev) => ({
                                        ...prev,
                                        [String(app.id)]: e.target.value,
                                      }))
                                    }
                                  >
                                    {uniqStrings([
                                      ...COMMON_STATUS_OPTIONS,
                                      ...(statusOptions || []),
                                    ]).map((s) => (
                                      <option key={s} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => saveStatus(app.id)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelEditStatus}
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <div className="muted" style={{ fontSize: 12 }}>
                                  Saving a status change automatically adds a timeline event.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div className="muted" style={{ fontSize: 13 }}>
                          Timeline events: <strong>{timeline.length}</strong>
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => toggleExpanded(app.id)}
                        >
                          {isExpanded ? "Hide timeline" : "View timeline"}
                        </button>
                      </div>

                      {isExpanded ? (
                        <div style={{ display: "grid", gap: 12 }}>
                          {/* Add new event */}
                          <div
                            className="card"
                            style={{
                              borderRadius: 10,
                              borderStyle: "dashed",
                              background: "rgba(55, 65, 81, 0.02)",
                            }}
                          >
                            <div className="card-body" style={{ padding: 12 }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "baseline",
                                  gap: 10,
                                  flexWrap: "wrap",
                                  marginBottom: 10,
                                }}
                              >
                                <div style={{ fontWeight: 900 }}>Add timeline event</div>
                                <div className="muted" style={{ fontSize: 12 }}>
                                  Example: Interview Scheduled, Follow-up, Rejected…
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "140px 1fr",
                                  gap: 10,
                                }}
                              >
                                <div style={{ display: "grid", gap: 6 }}>
                                  <label
                                    className="muted"
                                    htmlFor={`evt-date-${app.id}`}
                                    style={{ fontSize: 13 }}
                                  >
                                    Date
                                  </label>
                                  <input
                                    id={`evt-date-${app.id}`}
                                    className="input"
                                    type="date"
                                    value={timelineDraft.date || isoToday()}
                                    onChange={(e) =>
                                      setTimelineDraft(app.id, { date: e.target.value })
                                    }
                                  />
                                </div>

                                <div style={{ display: "grid", gap: 6 }}>
                                  <label
                                    className="muted"
                                    htmlFor={`evt-type-${app.id}`}
                                    style={{ fontSize: 13 }}
                                  >
                                    Type
                                  </label>
                                  <input
                                    id={`evt-type-${app.id}`}
                                    className="input"
                                    value={timelineDraft.type || ""}
                                    onChange={(e) =>
                                      setTimelineDraft(app.id, { type: e.target.value })
                                    }
                                    placeholder="e.g., Interview Scheduled"
                                  />
                                </div>

                                <div style={{ gridColumn: "1 / -1", display: "grid", gap: 6 }}>
                                  <label
                                    className="muted"
                                    htmlFor={`evt-note-${app.id}`}
                                    style={{ fontSize: 13 }}
                                  >
                                    Note (optional)
                                  </label>
                                  <textarea
                                    id={`evt-note-${app.id}`}
                                    className="textarea"
                                    rows={2}
                                    value={timelineDraft.note || ""}
                                    onChange={(e) =>
                                      setTimelineDraft(app.id, { note: e.target.value })
                                    }
                                    placeholder="Add details (contact, time, links, next steps)…"
                                  />
                                </div>

                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => addTimelineEvent(app.id)}
                                    disabled={!String(timelineDraft.type || "").trim()}
                                  >
                                    Add event
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Timeline list */}
                          {timeline.length === 0 ? (
                            <div className="muted" style={{ fontSize: 13 }}>
                              No timeline events yet.
                            </div>
                          ) : (
                            <div style={{ display: "grid", gap: 8 }}>
                              {timeline.map((evt) => (
                                <div
                                  key={evt.id}
                                  className="card"
                                  style={{
                                    borderRadius: 10,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                  }}
                                >
                                  <div
                                    className="card-body"
                                    style={{
                                      padding: 12,
                                      display: "grid",
                                      gap: 6,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 10,
                                        flexWrap: "wrap",
                                        alignItems: "baseline",
                                      }}
                                    >
                                      <div style={{ fontWeight: 900 }}>{evt.type}</div>
                                      <div className="muted" style={{ fontSize: 13 }}>
                                        {formatEventDate(evt.date)}
                                      </div>
                                    </div>
                                    {evt.note ? (
                                      <div style={{ lineHeight: 1.45 }}>{evt.note}</div>
                                    ) : (
                                      <div className="muted" style={{ fontSize: 13 }}>
                                        No notes.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <style>
            {`
              @media (max-width: 900px) {
                .container [data-apps-controls-grid] {
                  grid-template-columns: 1fr;
                }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
}
