import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNotificationsStore } from "../../state/notificationsStore";
import { getUnreadCount, loadNotifications } from "../../utils/notificationsStorage";

const linkClassName = ({ isActive }) =>
  `navlink ${isActive ? "navlink-active" : ""}`;

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation for Talenvia modules.
 */
export default function Sidebar() {
  const { unreadCount, setUnreadCount } = useNotificationsStore();

  // Best-effort: keep unread count initialized even if user never visits Notifications page.
  useEffect(() => {
    setUnreadCount(getUnreadCount(loadNotifications()));
  }, [setUnreadCount]);

  return (
    <nav className="sidebar-nav" aria-label="Primary">
      <NavLink to="/profile" className={linkClassName}>
        Profile
      </NavLink>
      <NavLink to="/dashboard" className={linkClassName}>
        Dashboard
      </NavLink>
      <NavLink to="/jobs" className={linkClassName}>
        Jobs (Search/List)
      </NavLink>
      <NavLink to="/ai-matching" className={linkClassName}>
        AI Job Matching
      </NavLink>

      <NavLink to="/tests" className={linkClassName}>
        Mock Tests
      </NavLink>
      <NavLink to="/challenges" className={linkClassName}>
        Gamified Challenges
      </NavLink>
      <NavLink to="/applications" className={linkClassName}>
        Application Tracking
      </NavLink>

      <NavLink to="/notifications" className={linkClassName}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Notifications
          {unreadCount > 0 ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 20,
                height: 20,
                padding: "0 6px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 900,
                color: "white",
                background: "var(--color-primary)",
                lineHeight: 1,
              }}
              aria-label={`${unreadCount} unread notifications`}
              title={`${unreadCount} unread`}
            >
              {unreadCount}
            </span>
          ) : null}
        </span>
      </NavLink>

      <NavLink to="/mentor" className={linkClassName}>
        AI Career Mentor
      </NavLink>
    </nav>
  );
}
