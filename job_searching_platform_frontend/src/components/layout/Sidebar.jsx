import React, { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useNotificationsStore } from "../../state/notificationsStore";
import { getUnreadCount, loadNotifications } from "../../utils/notificationsStorage";

const linkClassName = ({ isActive }) =>
  `navlink navlink--sidebar ${isActive ? "navlink-active" : ""}`;

function isProbablyRegisteredRoute(pathname) {
  // Keep this list aligned with src/routes/index.jsx. If the route doesn't exist,
  // we still render a "disabled" item so the app never breaks.
  const known = new Set([
    "/dashboard",
    "/profile",
    "/jobs",
    "/ai-matching",
    "/tests",
    "/challenges",
    "/applications",
    "/notifications",
    "/mentor",
  ]);
  return known.has(pathname);
}

// PUBLIC_INTERFACE
function NavItem({ to, icon, label, rightSlot }) {
  /** A single sidebar navigation item (icon + label), with safe fallback when route is missing. */
  const enabled = isProbablyRegisteredRoute(to);

  if (!enabled) {
    return (
      <span
        className="navlink navlink--sidebar navlink-disabled"
        role="link"
        aria-disabled="true"
        tabIndex={-1}
        title="Coming soon"
      >
        <span className="navlink-icon" aria-hidden="true">
          {icon}
        </span>
        <span className="navlink-label">{label}</span>
        {rightSlot ? <span className="navlink-right">{rightSlot}</span> : null}
      </span>
    );
  }

  return (
    <NavLink to={to} className={linkClassName}>
      <span className="navlink-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="navlink-label">{label}</span>
      {rightSlot ? <span className="navlink-right">{rightSlot}</span> : null}
    </NavLink>
  );
}

// PUBLIC_INTERFACE
function NavGroup({ title, children }) {
  /** A labeled group section in the sidebar for clearer information architecture. */
  return (
    <section className="sidebar-group" aria-label={title}>
      <div className="sidebar-group-title">{title}</div>
      <div className="sidebar-group-items" role="list">
        {children}
      </div>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation for the job search app: grouped sections, icons, and active state styling.
 */
export default function Sidebar() {
  const { unreadCount, setUnreadCount } = useNotificationsStore();

  // Best-effort: keep unread count initialized even if user never visits Notifications page.
  useEffect(() => {
    setUnreadCount(getUnreadCount(loadNotifications()));
  }, [setUnreadCount]);

  const unreadBadge = useMemo(() => {
    if (!unreadCount || unreadCount <= 0) return null;
    return (
      <span
        className="sidebar-badge"
        aria-label={`${unreadCount} unread notifications`}
        title={`${unreadCount} unread`}
      >
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    );
  }, [unreadCount]);

  return (
    <nav className="sidebar-nav" aria-label="Primary">
      <NavGroup title="Profile">
        <NavItem to="/dashboard" icon="📊" label="Dashboard" />
        <NavItem to="/profile" icon="👤" label="My Profile" />
      </NavGroup>

      <NavGroup title="Jobs">
        <NavItem to="/jobs" icon="🔎" label="Find Jobs" />
        <NavItem to="/ai-matching" icon="✨" label="AI Job Matching" />
        <NavItem to="/saved-jobs" icon="🔖" label="Saved Jobs" />
      </NavGroup>

      <NavGroup title="Assessments">
        <NavItem to="/tests" icon="🧠" label="Mock Tests" />
        <NavItem to="/challenges" icon="🏁" label="Skill Challenges" />
      </NavGroup>

      <NavGroup title="Tracking">
        <NavItem to="/applications" icon="📌" label="Applications" />
        <NavItem
          to="/notifications"
          icon="🔔"
          label="Notifications"
          rightSlot={unreadBadge}
        />
      </NavGroup>

      <NavGroup title="Guidance">
        <NavItem to="/mentor" icon="🤖" label="AI Career Mentor" />
      </NavGroup>
    </nav>
  );
}
