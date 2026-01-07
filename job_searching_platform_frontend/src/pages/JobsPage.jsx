import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { jobsData } from "../data/jobsData";

/**
 * Normalize a value to a search-friendly lowercase string.
 * @param {unknown} value
 */
function toSearchText(value) {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
}

/**
 * PUBLIC_INTERFACE
 * JobsPage: search/list view backed by local static jobsData (no remote calls).
 */
export default function JobsPage() {
  const [query, setQuery] = useState("");

  const filteredJobs = useMemo(() => {
    const q = toSearchText(query).trim();
    if (!q) return jobsData;

    return jobsData.filter((job) => {
      const haystack = [
        job.title,
        job.company,
        job.location,
        // skills may be array or missing
        Array.isArray(job.skills) ? job.skills.join(" ") : job.skills,
      ]
        .map(toSearchText)
        .join(" • ");

      return haystack.includes(q);
    });
  }, [query]);

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1">Jobs</h1>
            <div className="muted">
              Browse jobs from a local static dataset. Search matches{" "}
              <strong>title</strong>, <strong>company</strong>,{" "}
              <strong>location</strong>, and <strong>skills</strong>.
            </div>
          </div>

          <div
            className="card"
            style={{ background: "rgba(55, 65, 81, 0.03)" }}
          >
            <div className="card-body" style={{ display: "grid", gap: 10 }}>
              <div className="h2">Search</div>
              <div style={{ display: "grid", gap: 8 }}>
                <label className="label" htmlFor="jobs-search">
                  Search text
                </label>
                <input
                  id="jobs-search"
                  className="input"
                  type="text"
                  placeholder="e.g., React, London, Nimbus, SQL…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="muted" style={{ fontSize: 13 }}>
                  Showing <strong>{filteredJobs.length}</strong> of{" "}
                  <strong>{jobsData.length}</strong>.
                </div>
              </div>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="h2">No results</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Try a different search term (title, company, location, skills).
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {filteredJobs.map((job) => (
                <div className="card" key={job.id}>
                  <div className="card-body" style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "grid", gap: 2 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div className="h2">{job.title}</div>
                        <Link
                          className="btn btn-secondary"
                          to={`/jobs/${encodeURIComponent(job.id)}`}
                        >
                          View details
                        </Link>
                      </div>

                      <div className="muted">
                        {job.company}
                        {job.location ? ` • ${job.location}` : ""}
                      </div>
                    </div>

                    {job.summary ? <div>{job.summary}</div> : null}

                    {Array.isArray(job.skills) && job.skills.length ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          marginTop: 2,
                        }}
                        aria-label="Job skills"
                      >
                        {job.skills.map((s) => (
                          <span
                            key={s}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 999,
                              border: "1px solid var(--color-border)",
                              background: "rgba(55, 65, 81, 0.04)",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
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
