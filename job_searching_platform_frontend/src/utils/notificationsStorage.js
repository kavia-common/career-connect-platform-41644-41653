/**
 * Local persistence utilities for Notifications.
 *
 * This module provides a frontend-only persistence layer that:
 * - seeds from the static `initialNotifications`
 * - persists read/unread state in localStorage
 * - provides helpers to toggle read, mark all read, and compute unread count
 */

import { initialNotifications } from "../data/initialNotifications";

const STORAGE_KEY = "cc.notifications.v1";

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function makeId(prefix = "ntf") {
  // Good enough for local-only identifiers if seeds lack ids.
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeSeedNotification(n) {
  const id =
    typeof n?.id === "string" && n.id.trim() ? n.id.trim() : makeId("ntf");
  const title = String(n?.title ?? n?.subject ?? "Notification").trim();
  const message = String(n?.message ?? n?.body ?? n?.text ?? "").trim();
  const createdAt = String(n?.createdAt ?? n?.date ?? n?.time ?? "").trim();

  const type = typeof n?.type === "string" ? n.type : undefined;

  // `read` is persisted, but seed may include it.
  const read = Boolean(n?.read);

  return {
    id,
    title,
    message,
    createdAt,
    type,
    read,
  };
}

function makeSeed() {
  return (Array.isArray(initialNotifications) ? initialNotifications : [])
    .map(normalizeSeedNotification)
    .filter((n) => typeof n.id === "string" && n.id.trim().length > 0);
}

/**
 * PUBLIC_INTERFACE
 * loadNotifications returns persisted notifications if present, else a normalized seed derived
 * from the static dataset.
 *
 * @returns {Array<{id: string, title: string, message: string, createdAt: string, type?: string, read: boolean}>}
 */
export function loadNotifications() {
  const seed = makeSeed();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;

    const parsed = safeJsonParse(raw, null);
    if (!Array.isArray(parsed)) return seed;

    // Merge persisted over seed by id (seed provides new records if dataset grows).
    const persistedById = new Map(
      parsed
        .filter((n) => n && (typeof n.id === "string" || typeof n.id === "number"))
        .map((n) => [String(n.id), n])
    );

    const merged = seed.map((s) => {
      const p = persistedById.get(String(s.id));
      if (!p || typeof p !== "object") return s;
      return normalizeSeedNotification({ ...s, ...p, id: s.id });
    });

    // Include persisted-only records for resilience.
    for (const [id, p] of persistedById.entries()) {
      if (merged.some((m) => String(m.id) === String(id))) continue;
      merged.push(normalizeSeedNotification(p));
    }

    return merged;
  } catch {
    return seed;
  }
}

/**
 * PUBLIC_INTERFACE
 * saveNotifications persists the full notifications list to localStorage.
 *
 * @param {Array<{id: string, title: string, message: string, createdAt: string, type?: string, read: boolean}>} notifications
 * @returns {boolean}
 */
export function saveNotifications(notifications) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.isArray(notifications) ? notifications : [])
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * markAllNotificationsRead marks all notifications as read and persists them.
 */
export function markAllNotificationsRead() {
  const notifications = loadNotifications();
  const updated = (notifications ?? []).map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
}

/**
 * PUBLIC_INTERFACE
 * toggleNotificationRead toggles read/unread for a notification id.
 *
 * @param {Array<{id: string, read: boolean}>} notifications
 * @param {string} id
 * @returns {Array<any>} updated list
 */
export function toggleNotificationRead(notifications, id) {
  const key = String(id);
  return (notifications ?? []).map((n) => {
    if (String(n?.id) !== key) return n;
    return { ...n, read: !Boolean(n?.read) };
  });
}

/**
 * PUBLIC_INTERFACE
 * getUnreadCount returns number of unread notifications.
 *
 * @param {Array<{read: boolean}>} notifications
 * @returns {number}
 */
export function getUnreadCount(notifications) {
  return (notifications ?? []).reduce((acc, n) => acc + (n?.read ? 0 : 1), 0);
}

/**
 * PUBLIC_INTERFACE
 * resetNotifications clears local storage so the UI returns to the static seed.
 */
export function resetNotifications() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
