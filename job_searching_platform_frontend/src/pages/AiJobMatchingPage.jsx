import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { jobsData } from "../data/jobsData";
import { buildJobDocumentText, tfidfCosineMatch } from "../utils/tfidfMatch";

/**
 * PUBLIC_INTERFACE
 * AI Job Matching page (client-side TF-IDF fallback).
 *
 * Uses TF-IDF + cosine similarity (inspired by the provided Python snippet) to
 * score user-provided resume/skills text against the current static jobs dataset.
 *
 * When a backend `/ai/match` endpoint becomes available, this page can be upgraded
 * to call it first, then fall back to this local scorer if the API is unavailable.
 */
export default function AiJobMatchingPage() {
  const [resumeText, setResumeText] = useState("React JavaScript HTML CSS");
  const [minMatch, setMinMatch] = useState(15);
  const [topN, setTopN] = useState(10);

  const jobDocuments = useMemo(() => {
    return jobsData.map((job) => ({
      id: job.id,
      text: buildJobDocumentText(job),
    }));
  }, []);

  const ranked = useMemo(() => {
    const trimmed = (resumeText || "").trim();
    if (!trimmed) return [];

    const matches = tfidfCosineMatch(trimmed, jobDocuments);

    // map results back to jobs
    const byId = new Map(jobsData.map((j) => [j.id, j]));
    return matches
      .map((m) => {
        const job = byId.get(m.id);
        return {
          job,
          score: m.score,
          percent: Math.round(m.score * 1000) / 10, // 1 decimal
        };
      })
      .filter((x) => x.job)
      .filter((x) => x.percent >= Number(minMatch || 0))
      .slice(0, Number(topN || 10));
  }, [resumeText, jobDocuments, minMatch, topN]);

  const hasInput = (resumeText || "").trim().length > 0;

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <h1 className="h1" style={{ margin: 0 }}>
              AI Job Matching
            </h1>
            <div className="muted">
              Client-side TF‑IDF + cosine similarity (fallback) using current static job listings.
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(17,24,39,0.08)",
            }}
          >
            <div className="card-body" style={{ display: "grid", gap: 10 }}>
              <label className="label" htmlFor="resumeText">
                Resume / Skills (paste keywords, tech stack, experience)
              </label>
              <textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={5}
                placeholder="Example: React JavaScript HTML CSS UI/UX TypeScript REST APIs..."
                style={{
                  width: "100%",
                  resize: "vertical",
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid rgba(17,24,39,0.12)",
                  fontFamily: "inherit",
                  lineHeight: 1.4,
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <label className="label" htmlFor="minMatch">
                    Minimum match (%)
                  </label>
                  <input
                    id="minMatch"
                    type="number"
                    min={0}
                    max={100}
                    value={minMatch}
                    onChange={(e) => setMinMatch(e.target.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(17,24,39,0.12)",
                      background: "white",
                    }}
                  />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <label className="label" htmlFor="topN">
                    Show top N
                  </label>
                  <input
                    id="topN"
                    type="number"
                    min={1}
                    max={50}
                    value={topN}
                    onChange={(e) => setTopN(e.target.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(17,24,39,0.12)",
                      background: "white",
                    }}
                  />
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <span className="label">Dataset</span>
                  <div className="muted" style={{ paddingTop: 10 }}>
                    {jobsData.length} jobs (static)
                  </div>
                </div>
              </div>

              {!hasInput ? (
                <div className="muted">Enter your skills above to see ranked matches.</div>
              ) : (
                <div className="muted">
                  Tip: include tools, frameworks, and keywords (e.g., “React Query”, “PostgreSQL”, “GraphQL”, “Docker”).
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <h2 className="h2" style={{ margin: 0 }}>
              Match Results
            </h2>

            {!hasInput ? (
              <div className="muted">No results yet.</div>
            ) : ranked.length === 0 ? (
              <div className="muted">No jobs met the minimum match threshold.</div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {ranked.map(({ job, percent, score }) => (
                  <div
                    key={job.id}
                    className="card"
                    style={{
                      border: "1px solid rgba(17,24,39,0.08)",
                    }}
                  >
                    <div className="card-body" style={{ display: "grid", gap: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "baseline",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ display: "grid", gap: 2 }}>
                          <div style={{ fontWeight: 700 }}>{job.title}</div>
                          <div className="muted">
                            {job.company} • {job.location}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: 150 }}>
                          <div style={{ fontWeight: 700 }}>{percent}% match</div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            cosine: {score.toFixed(4)}
                          </div>
                        </div>
                      </div>

                      <div
                        aria-hidden="true"
                        style={{
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(156,163,175,0.25)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.max(0, Math.min(100, percent))}%`,
                            background: "var(--primary, #374151)",
                          }}
                        />
                      </div>

                      {job.summary ? <div className="muted">{job.summary}</div> : null}

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Link className="btn" to={`/jobs/${job.id}`}>
                          View details
                        </Link>
                        {job.applyUrl ? (
                          <a className="btn btn-secondary" href={job.applyUrl} target="_blank" rel="noreferrer">
                            Apply
                          </a>
                        ) : null}
                      </div>

                      {Array.isArray(job.skills) && job.skills.length > 0 ? (
                        <div className="muted" style={{ fontSize: 12 }}>
                          <strong>Skills:</strong> {job.skills.join(", ")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Note: This uses a local TF‑IDF implementation for matching. A future iteration can send your text to a backend
              model (e.g., embeddings) and fall back to this for offline/preview mode.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
