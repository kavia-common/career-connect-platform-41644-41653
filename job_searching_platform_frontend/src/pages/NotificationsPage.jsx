import React, { useEffect, useMemo, useState } from "react";
import {
  getUnreadCount,
  loadNotifications,
  markAllNotificationsRead,
  resetNotifications,
  saveNotifications,
  toggleNotificationRead,
} from "../utils/notificationsStorage";
import { useNotificationsStore } from "../state/notificationsStore";

function toSearchText(value) {
  if (value === null || value === undefined) return "";
  return String(value).toLowerCase();
}

function toTime(iso) {
  if (!iso) return Number.NaN;
  const t = Date.parse(String(iso));
  return Number.isFinite(t) ? t : Number.NaN;
}

function formatWhen(value) {
  const t = Date.parse(String(value || ""));
  if (!Number.isFinite(t)) return String(value || "—");
  return new Date(t).toLocaleString();
}

/**
 * PUBLIC_INTERFACE
 * NotificationsPage: local notification center backed by `initialNotifications`
 * with localStorage persistence for read/unread state.
 *
 * Features:
 * - Unread/read filter toggle
 * - Search
 * - Mark all as read
 * - Per-notification read toggle
 * - Reset local edits (returns to seed)
 */
export default function NotificationsPage() {
  const { setUnreadCount } = useNotificationsStore();

  const [notifications, setNotifications] = useState(() => loadNotifications());

  // Filters / UI state
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [query, setQuery] = useState("");

  // Persist changes and reflect unread count globally.
  useEffect(() => {
    saveNotifications(notifications);
    setUnreadCount(getUnreadCount(notifications));
  }, [notifications, setUnreadCount]);

  // Initialize unread count on first mount (in case other pages rely on it).
  useEffect(() => {
    setUnreadCount(getUnreadCount(loadNotifications()));
  }, [setUnreadCount]);

  const unreadCount = useMemo(
    () => getUnreadCount(notifications),
    [notifications]
  );

  const filtered = useMemo(() => {
    const q = toSearchText(query).trim();

    return notifications.filter((n) => {
      if (showUnreadOnly && n.read) return false;

      if (q) {
        const haystack = [n.title, n.message, n.type, n.createdAt]
          .map(toSearchText)
          .join(" • ");
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [notifications, showUnreadOnly, query]);

  const sorted = useMemo(() => {
    const base = [...filtered];
    base.sort((a, b) => {
      const ta = toTime(a.createdAt);
      const tb = toTime(b.createdAt);
      if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
      if (Number.isNaN(ta)) return 1;
      if (Number.isNaN(tb)) return -1;
      return tb - ta;
    });
    return base;
  }, [filtered]);

  function onToggleRead(id) {
    setNotifications((prev) => toggleNotificationRead(prev, id));
  }

  function onMarkAllRead() {
    setNotifications((prev) => markAllNotificationsRead(prev));
  }

  function onResetLocal() {
    resetNotifications();
    const next = loadNotifications();
    setNotifications(next);
    setUnreadCount(getUnreadCount(next));
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-body" style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h1 className="h1">Notifications</h1>
            <div className="muted">
              Manage your alerts and updates. Unread notifications are highlighted
              and can be marked read individually or all at once.
            </div>
          </div>

          {/* Controls */}
          <div className="card" style={{ background: "rgba(55, 65, 81, 0.03)" }}>
            <div className="card-body" style={{ display: "grid", gap: 12 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: 12,
                  alignItems: "end",
                }}
              >
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="ntf-q">
                    Search
                  </label>
                  <input
                    id="ntf-q"
                    className="input"
                    type="text"
                    placeholder="Search notifications…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label className="label" htmlFor="ntf-filter">
                    Filter
                  </label>
                  <select
                    id="ntf-filter"
                    className="select"
                    value={showUnreadOnly ? "unread" : "all"}
                    onChange={(e) => setShowUnreadOnly(e.target.value === "unread")}
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread only</option>
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
                  Total: <strong>{notifications.length}</strong> • Unread:{" "}
                  <strong>{unreadCount}</strong> • Showing:{" "}
                  <strong>{sorted.length}</strong>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onMarkAllRead}
                    disabled={unreadCount === 0}
                    title="Marks every notification as read"
                  >
                    Mark all read
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onResetLocal}
                    title="Clears locally saved edits and returns to the seed data"
                  >
                    Reset local
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          {sorted.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="h2">No notifications</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  Try changing the filter or search query.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {sorted.map((n) => {
                const isUnread = !n.read;

                return (
                  <div
                    key={n.id}
                    className="card"
                    style={{
                      borderLeft: isUnread
                        ? "4px solid var(--color-primary)"
                        : "4px solid transparent",
                      background: isUnread
                        ? "rgba(55, 65, 81, 0.03)"
                        : "var(--color-surface)",
                    }}
                  >
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
                        <div style={{ display: "grid", gap: 4, minWidth: 260 }}>
                          <div className="h2" style={{ margin: 0 }}>
                            {n.title}
                          </div>
                          <div className="muted" style={{ fontSize: 13 }}>
                            {n.type ? (
                              <>
                                <span style={{ fontWeight: 800 }}>{n.type}</span> •{" "}
                              </>
                            ) : null}
                            {formatWhen(n.createdAt)}
                            {isUnread ? (
                              <>
                                {" "}
                                • <span style={{ fontWeight: 900 }}>Unread</span>
                              </>
                            ) : (
                              <>
                                {" "}
                                • <span>Read</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => onToggleRead(n.id)}
                          >
                            Mark {isUnread ? "read" : "unread"}
                          </button>
                        </div>
                      </div>

                      {n.message ? (
                        <div style={{ lineHeight: 1.5 }}>{n.message}</div>
                      ) : (
                        <div className="muted" style={{ fontSize: 13 }}>
                          No details.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
