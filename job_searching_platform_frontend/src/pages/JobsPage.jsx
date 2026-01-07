import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobsData } from "../data/jobsData";
import { buildJobDocumentText, tfidfCosineMatch } from "../utils/tfidfMatch";

/**
 * Normalize a value to a search-friendly lowercase string.
 * @param {unknown} value
 */
function toSearchText(value) {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
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

function parseCsvParam(value) {
  if (!value) return [];
  return uniqStrings(
    String(value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function stringifyCsvParam(list) {
  const cleaned = uniqStrings(list);
  return cleaned.join(",");
}

/**
 * PUBLIC_INTERFACE
 * JobsPage: search/list view backed by local static jobsData (no remote calls).
 * Adds client-side filters + sorting and (preferred) URL query param syncing.
 */
export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- State (initialized from URL params) ---
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [locationFilter, setLocationFilter] = useState(
    () => searchParams.get("loc") || ""
  );
  const [experienceFilter, setExperienceFilter] = useState(
    () => searchParams.get("exp") || ""
  );
  const [skillsFilter, setSkillsFilter] = useState(() =>
    parseCsvParam(searchParams.get("skills"))
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "relevance"
  );

  // --- Facets (from data) ---
  const locationOptions = useMemo(() => {
    const locs = jobsData
      .map((j) => j.location)
      .filter(Boolean)
      .map((l) => String(l));
    // Make options stable and readable (case-insensitive sort)
    return uniqStrings(locs).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }, []);

  const experienceOptions = useMemo(() => {
    // `jobsData` uses `seniority` (junior/mid/senior/lead).
    const exps = jobsData
      .map((j) => j.seniority)
      .filter(Boolean)
      .map((s) => String(s));
    const uniq = uniqStrings(exps);
    // Keep a sensible order if possible; otherwise alpha
    const order = ["intern", "junior", "mid", "senior", "lead", "staff", "principal"];
    const orderIndex = new Map(order.map((v, i) => [v, i]));
    return uniq.sort((a, b) => {
      const ai = orderIndex.has(a.toLowerCase())
        ? orderIndex.get(a.toLowerCase())
        : 999;
      const bi = orderIndex.has(b.toLowerCase())
        ? orderIndex.get(b.toLowerCase())
        : 999;
      if (ai !== bi) return ai - bi;
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }, []);

  const skillsOptions = useMemo(() => {
    const skills = [];
    for (const j of jobsData) {
      if (Array.isArray(j.skills)) skills.push(...j.skills);
      else if (typeof j.skills === "string") skills.push(j.skills);
    }
    return uniqStrings(skills).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }, []);

  // --- URL syncing (preferred): keep URL in sync with current UI state ---
  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    const setOrDelete = (key, value) => {
      const v = String(value || "").trim();
      if (!v) next.delete(key);
      else next.set(key, v);
    };

    setOrDelete("q", query);
    setOrDelete("loc", locationFilter);
    setOrDelete("exp", experienceFilter);

    const skillsCsv = stringifyCsvParam(skillsFilter);
    setOrDelete("skills", skillsCsv);

    // Sort: always store if not default, to be explicit in deep-links
    setOrDelete("sort", sortBy);

    // Avoid unnecessary history entries
    const current = searchParams.toString();
    const updated = next.toString();
    if (current !== updated) {
      setSearchParams(next, { replace: true });
    }
    // Intentionally omit setSearchParams from deps? It's stable from react-router.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, locationFilter, experienceFilter, skillsFilter, sortBy]);

  // If URL changes externally (back/forward), update state accordingly.
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    const urlLoc = searchParams.get("loc") || "";
    const urlExp = searchParams.get("exp") || "";
    const urlSkills = parseCsvParam(searchParams.get("skills"));
    const urlSort = searchParams.get("sort") || "relevance";

    // Only update when different to avoid cursor-jumps while typing.
    if (urlQ !== query) setQuery(urlQ);
    if (urlLoc !== locationFilter) setLocationFilter(urlLoc);
    if (urlExp !== experienceFilter) setExperienceFilter(urlExp);

    const skillsA = stringifyCsvParam(urlSkills);
    const skillsB = stringifyCsvParam(skillsFilter);
    if (skillsA !== skillsB) setSkillsFilter(urlSkills);

    if (urlSort !== sortBy) setSortBy(urlSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredJobs = useMemo(() => {
    const q = toSearchText(query).trim();
    const locQ = toSearchText(locationFilter).trim();
    const expQ = toSearchText(experienceFilter).trim();
    const selectedSkillsLower = new Set(skillsFilter.map((s) => s.toLowerCase()));

    return jobsData.filter((job) => {
      // Preserve existing search behavior (simple includes across key fields)
      if (q) {
        const haystack = [
          job.title,
          job.company,
          job.location,
          Array.isArray(job.skills) ? job.skills.join(" ") : job.skills,
        ]
          .map(toSearchText)
          .join(" • ");

        if (!haystack.includes(q)) return false;
      }

      // Location filter (substring match so it works for "Remote", "London", etc.)
      if (locQ) {
        const jobLoc = toSearchText(job.location);
        if (!jobLoc.includes(locQ)) return false;
      }

      // Experience filter (match exact normalized seniority; fallback to includes)
      if (expQ) {
        const jobExp = toSearchText(job.seniority);
        if (!jobExp) return false;
        if (jobExp !== expQ && !jobExp.includes(expQ)) return false;
      }

      // Skills includes-any filter (OR logic)
      if (selectedSkillsLower.size > 0) {
        const jobSkills = Array.isArray(job.skills)
          ? job.skills.map((s) => String(s).toLowerCase())
          : typeof job.skills === "string"
            ? [job.skills.toLowerCase()]
            : [];

        const hasAny = jobSkills.some((s) => selectedSkillsLower.has(s));
        if (!hasAny) return false;
      }

      return true;
    });
  }, [query, locationFilter, experienceFilter, skillsFilter]);

  const sortedJobs = useMemo(() => {
    const base = [...filteredJobs];

    if (sortBy === "title") {
      base.sort((a, b) =>
        toSearchText(a.title).localeCompare(toSearchText(b.title))
      );
      return base;
    }

    if (sortBy === "company") {
      base.sort((a, b) =>
        toSearchText(a.company).localeCompare(toSearchText(b.company))
      );
      return base;
    }

    // Default: relevance to search query (TF‑IDF cosine similarity).
    // If query empty, keep original dataset order (stable and predictable).
    const q = String(query || "").trim();
    if (!q) return base;

    const docs = base.map((job) => ({
      id: job.id,
      text: buildJobDocumentText(job),
    }));

    const scored = tfidfCosineMatch(q, docs);

    // Map score by job id (some jobs might share ids in other datasets; safe here).
    const scoreById = new Map(scored.map((r) => [r.id, r.score]));

    base.sort((a, b) => {
      const sa = scoreById.get(a.id) || 0;
      const sb = scoreById.get(b.id) || 0;
      if (sb !== sa) return sb - sa;
      // Tie-breakers for stable ordering
      return toSearchText(a.title).localeCompare(toSearchText(b.title));
    });

    return base;
  }, [filteredJobs, sortBy, query]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (String(locationFilter || "").trim()) n += 1;
    if (String(experienceFilter || "").trim()) n += 1;
    if (skillsFilter.length) n += 1;
    return n;
  }, [locationFilter, experienceFilter, skillsFilter]);

  function toggleSkill(skill) {
    setSkillsFilter((prev) => {
      const lower = skill.toLowerCase();
      const exists = prev.some((s) => s.toLowerCase() === lower);
      if (exists) return prev.filter((s) => s.toLowerCase() !== lower);
      return [...prev, skill];
    });
  }

  function clearFilters() {
    setLocationFilter("");
    setExperienceFilter("");
    setSkillsFilter([]);
  }

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

          {/* Search + sort */}
          <div
            className="card"
            style={{ background: "rgba(55, 65, 81, 0.03)" }}
          >
            <div className="card-body" style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div className="h2">Search</div>

                <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
                  <label className="label" htmlFor="jobs-sort">
                    Sort by
                  </label>
                  <select
                    id="jobs-sort"
                    className="select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title">Title (A–Z)</option>
                    <option value="company">Company (A–Z)</option>
                  </select>
                </div>
              </div>

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
                  Showing <strong>{sortedJobs.length}</strong> of{" "}
                  <strong>{jobsData.length}</strong>
                  {activeFilterCount ? (
                    <>
                      {" "}
                      • Filters: <strong>{activeFilterCount}</strong>
                    </>
                  ) : null}
                  .
                </div>
              </div>
            </div>
          </div>

          {/* Filters panel */}
          <div className="card">
            <div className="card-body" style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <div className="h2">Filters</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Filter by location, experience, and skills (includes any).
                  </div>
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="jobs-filter-location">
                    Location
                  </label>
                  <select
                    id="jobs-filter-location"
                    className="select"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">All locations</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="jobs-filter-exp">
                    Experience
                  </label>
                  <select
                    id="jobs-filter-exp"
                    className="select"
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                  >
                    <option value="">All levels</option>
                    {experienceOptions.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp.charAt(0).toUpperCase() + exp.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <div className="label">Skills (any)</div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid var(--color-border)",
                    background: "rgba(55, 65, 81, 0.02)",
                  }}
                  aria-label="Skill filters"
                >
                  {skillsOptions.map((skill) => {
                    const selected = skillsFilter.some(
                      (s) => s.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <button
                        key={skill}
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: "7px 10px",
                          borderRadius: 999,
                          borderColor: selected
                            ? "rgba(55, 65, 81, 0.35)"
                            : "var(--color-border)",
                          background: selected
                            ? "rgba(55, 65, 81, 0.10)"
                            : "transparent",
                          boxShadow: "none",
                          transform: "none",
                          fontSize: 13,
                        }}
                        aria-pressed={selected}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {skillsFilter.length ? (
                  <div className="muted" style={{ fontSize: 13 }}>
                    Selected:{" "}
                    <strong>{skillsFilter.map((s) => s).join(", ")}</strong>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Results */}
          {sortedJobs.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="h2">No results</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Try a different search term or remove filters.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {sortedJobs.map((job) => (
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
                        {job.seniority ? ` • ${job.seniority}` : ""}
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
