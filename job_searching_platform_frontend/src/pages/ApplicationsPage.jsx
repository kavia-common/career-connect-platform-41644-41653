import React, { useMemo, useState } from "react";
import { applicationsData } from "../data/applicationsData";

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

/**
 * PUBLIC_INTERFACE
 * ApplicationsPage: local application tracking view backed by static applicationsData.
 * Includes basic filters and sorting for status/date/company/title.
 */
export default function ApplicationsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const statusOptions = useMemo(() => {
    const statuses = applicationsData.map((a) => a.status).filter(Boolean);
    return uniqStrings(statuses).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }, []);

  const filtered = useMemo(() => {
    const q = toSearchText(query).trim();
    const s = toSearchText(statusFilter);

    return applicationsData.filter((app) => {
      if (q) {
        const haystack = [
          app.jobTitle,
          app.company,
          app.status,
          app.appliedDate,
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
  }, [query, statusFilter]);

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

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1">Application Tracking</h1>
            <div className="muted">
              Track your applications by <strong>company</strong>,{" "}
              <strong>job title</strong>, <strong>applied date</strong>, and{" "}
              <strong>status</strong>.
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
                    placeholder="Search by title, company, status…"
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
                  <strong>{applicationsData.length}</strong>
                  {activeFilterCount ? (
                    <>
                      {" "}
                      • Filters: <strong>{activeFilterCount}</strong>
                    </>
                  ) : null}
                  .
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearFilters}
                  disabled={!activeFilterCount}
                >
                  Clear filters
                </button>
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
              {sorted.map((app) => (
                <div className="card" key={app.id}>
                  <div className="card-body" style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "baseline",
                      }}
                    >
                      <div style={{ display: "grid", gap: 4 }}>
                        <div className="h2">{app.jobTitle}</div>
                        <div className="muted">
                          {app.company}
                          {app.appliedDate ? ` • Applied ${app.appliedDate}` : ""}
                        </div>
                      </div>

                      <span style={statusBadgeStyle(app.status)}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
