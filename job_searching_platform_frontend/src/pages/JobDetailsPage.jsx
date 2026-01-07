import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { jobsData } from "../data/jobsData";

/**
 * PUBLIC_INTERFACE
 * JobDetailsPage: details view backed by local static jobsData (no remote calls).
 */
export default function JobDetailsPage() {
  const { id } = useParams();

  const job = useMemo(() => jobsData.find((j) => j.id === id), [id]);

  if (!job) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body" style={{ display: "grid", gap: 10 }}>
            <h1 className="h1">Job not found</h1>
            <div className="muted">
              No job exists for id: <code>{id}</code>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-secondary" to="/jobs">
                Back to jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const salaryText =
    job.salaryMin || job.salaryMax
      ? `${job.currency || ""} ${job.salaryMin ?? "—"} – ${job.salaryMax ?? "—"}`
      : "";

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-secondary" to="/jobs">
              Back to jobs
            </Link>
            {job.applyUrl ? (
              <a
                className="btn btn-primary"
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
              >
                Apply
              </a>
            ) : null}
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1">{job.title}</h1>
            <div className="muted">
              {job.company}
              {job.location ? ` • ${job.location}` : ""}
            </div>
            {salaryText ? (
              <div className="muted">
                Salary: <strong>{salaryText}</strong>
              </div>
            ) : null}
          </div>

          {Array.isArray(job.skills) && job.skills.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              <div className="h2">Skills</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            </div>
          ) : null}

          {job.summary ? (
            <div style={{ display: "grid", gap: 8 }}>
              <div className="h2">Summary</div>
              <div>{job.summary}</div>
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 8 }}>
            <div className="h2">Description</div>
            <div className="card">
              <div className="card-body" style={{ whiteSpace: "pre-wrap" }}>
                {job.description || "No description provided."}
              </div>
            </div>
          </div>

          <div className="muted" style={{ fontSize: 13 }}>
            Dataset id: <code>{job.id}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
