import React from "react";
import { NavLink } from "react-router-dom";

const linkClassName = ({ isActive }) =>
  `navlink ${isActive ? "navlink-active" : ""}`;

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation for Talenvia modules.
 */
export default function Sidebar() {
  return (
    <nav className="sidebar-nav" aria-label="Primary">
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
        Notifications
      </NavLink>
      <NavLink to="/profile" className={linkClassName}>
        Profile
      </NavLink>
      <NavLink to="/mentor" className={linkClassName}>
        AI Career Mentor
      </NavLink>
    </nav>
  );
}
