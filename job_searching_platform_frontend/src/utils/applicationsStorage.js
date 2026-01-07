/**
 * Local persistence utilities for Applications tracking.
 *
 * This module provides a lightweight, frontend-only persistence layer that:
 * - seeds from the static `applicationsData`
 * - persists user edits in localStorage
 * - supports per-application timeline events
 *
 * NOTE: This is intentionally not a global store; pages can opt-in to using these helpers.
 */

import { applicationsData } from "../data/applicationsData";

const STORAGE_KEY = "cc.applications.v1";

/**
 * @typedef {Object} TimelineEvent
 * @property {string} id - Unique id for the event.
 * @property {string} date - ISO date string (YYYY-MM-DD or full ISO).
 * @property {string} type - Event type label (e.g., Applied, Interview Scheduled).
 * @property {string} note - Optional user note.
 */

/**
 * @typedef {Object} Application
 * @property {number} id
 * @property {string} jobTitle
 * @property {string} company
 * @property {string} appliedDate
 * @property {string} status
 * @property {TimelineEvent[]=} timeline
 */

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isoToday() {
  // YYYY-MM-DD (keeps UI consistent with the seed data format)
  return new Date().toISOString().slice(0, 10);
}

function makeId(prefix = "evt") {
  // Good enough for local-only identifiers.
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeSeedApplication(app) {
  const appliedDate = typeof app?.appliedDate === "string" ? app.appliedDate : "";
  const status = typeof app?.status === "string" ? app.status : "Applied";

  /** @type {TimelineEvent[]} */
  const baseTimeline = Array.isArray(app?.timeline) ? app.timeline : [];

  // Ensure we always have at least an "Applied" event when an appliedDate exists,
  // so the timeline isn't empty and aligns with the existing data approach.
  const needsAppliedEvent =
    appliedDate &&
    !baseTimeline.some((e) => String(e?.type || "").toLowerCase() === "applied");

  const normalizedTimeline = baseTimeline
    .map((e) => ({
      id: typeof e?.id === "string" ? e.id : makeId("evt"),
      date: typeof e?.date === "string" ? e.date : appliedDate || isoToday(),
      type: typeof e?.type === "string" ? e.type : "Note",
      note: typeof e?.note === "string" ? e.note : "",
    }))
    .filter((e) => e.type.trim().length > 0);

  if (needsAppliedEvent) {
    normalizedTimeline.unshift({
      id: makeId("evt"),
      date: appliedDate,
      type: "Applied",
      note: "",
    });
  }

  return {
    id: Number(app?.id),
    jobTitle: String(app?.jobTitle ?? ""),
    company: String(app?.company ?? ""),
    appliedDate,
    status,
    timeline: normalizedTimeline,
  };
}

function makeSeed() {
  return (Array.isArray(applicationsData) ? applicationsData : [])
    .map(normalizeSeedApplication)
    .filter((a) => Number.isFinite(a.id));
}

/**
 * PUBLIC_INTERFACE
 * loadApplications returns persisted applications if present, else a normalized seed derived
 * from the static dataset.
 *
 * @returns {Application[]} applications
 */
export function loadApplications() {
  const seed = makeSeed();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;

    const parsed = safeJsonParse(raw, null);
    if (!Array.isArray(parsed)) return seed;

    // Merge persisted with seed (seed provides defaults / new records if dataset grows later).
    const persistedById = new Map(
      parsed
        .filter((a) => a && (typeof a.id === "number" || typeof a.id === "string"))
        .map((a) => [Number(a.id), a])
        .filter(([id]) => Number.isFinite(id))
    );

    const merged = seed.map((s) => {
      const p = persistedById.get(s.id);
      if (!p || typeof p !== "object") return s;
      // persisted can override core fields + timeline
      return normalizeSeedApplication({
        ...s,
        ...p,
        id: s.id, // keep stable
      });
    });

    // Include any persisted-only records (in case the seed shrank; keep resilient).
    for (const [id, p] of persistedById.entries()) {
      if (merged.some((m) => m.id === id)) continue;
      merged.push(normalizeSeedApplication(p));
    }

    return merged;
  } catch {
    return seed;
  }
}

/**
 * PUBLIC_INTERFACE
 * saveApplications persists the full applications list to localStorage.
 *
 * @param {Application[]} applications
 * @returns {boolean} true if saved successfully
 */
export function saveApplications(applications) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications ?? []));
    return true;
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * resetApplications clears the saved applications so the UI returns to the static seed.
 */
export function resetApplications() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * upsertTimelineEvent adds a new timeline event to an application (prepends by default).
 *
 * @param {Application[]} applications
 * @param {number} applicationId
 * @param {{date?: string, type: string, note?: string}} eventInput
 * @returns {Application[]} updated applications list
 */
export function upsertTimelineEvent(applications, applicationId, eventInput) {
  const date =
    typeof eventInput?.date === "string" && eventInput.date.trim()
      ? eventInput.date.trim()
      : isoToday();

  const type = String(eventInput?.type ?? "").trim();
  const note = String(eventInput?.note ?? "").trim();

  if (!type) return applications;

  return (applications ?? []).map((a) => {
    if (Number(a?.id) !== Number(applicationId)) return a;

    const timeline = Array.isArray(a.timeline) ? a.timeline : [];
    const nextEvent = { id: makeId("evt"), date, type, note };

    // Keep timeline sorted descending by date in the UI by inserting and later sorting.
    const nextTimeline = [nextEvent, ...timeline].sort((e1, e2) => {
      const t1 = Date.parse(String(e1?.date || ""));
      const t2 = Date.parse(String(e2?.date || ""));
      if (!Number.isFinite(t1) && !Number.isFinite(t2)) return 0;
      if (!Number.isFinite(t1)) return 1;
      if (!Number.isFinite(t2)) return -1;
      return t2 - t1;
    });

    return { ...a, timeline: nextTimeline };
  });
}

/**
 * PUBLIC_INTERFACE
 * updateApplicationStatus updates the status and auto-appends a timeline event.
 *
 * If the status is unchanged, no event is appended.
 *
 * @param {Application[]} applications
 * @param {number} applicationId
 * @param {string} nextStatus
 * @param {{date?: string, note?: string}=} eventMeta
 * @returns {Application[]} updated list
 */
export function updateApplicationStatus(applications, applicationId, nextStatus, eventMeta) {
  const status = String(nextStatus ?? "").trim();
  if (!status) return applications;

  const date =
    typeof eventMeta?.date === "string" && eventMeta.date.trim()
      ? eventMeta.date.trim()
      : isoToday();
  const note = String(eventMeta?.note ?? "").trim();

  return (applications ?? []).map((a) => {
    if (Number(a?.id) !== Number(applicationId)) return a;

    const prevStatus = String(a?.status ?? "").trim();
    if (prevStatus === status) return a;

    const timeline = Array.isArray(a.timeline) ? a.timeline : [];
    const statusEvent = {
      id: makeId("evt"),
      date,
      type: status,
      note: note || `Status changed from "${prevStatus || "Unknown"}" to "${status}".`,
    };

    const nextTimeline = [statusEvent, ...timeline].sort((e1, e2) => {
      const t1 = Date.parse(String(e1?.date || ""));
      const t2 = Date.parse(String(e2?.date || ""));
      if (!Number.isFinite(t1) && !Number.isFinite(t2)) return 0;
      if (!Number.isFinite(t1)) return 1;
      if (!Number.isFinite(t2)) return -1;
      return t2 - t1;
    });

    return { ...a, status, timeline: nextTimeline };
  });
}
