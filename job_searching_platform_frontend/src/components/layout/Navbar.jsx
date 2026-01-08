import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/authStore";
import { useNotificationsStore } from "../../state/notificationsStore";

/**
 * PUBLIC_INTERFACE
 * Navbar: modern top navigation bar with logo, centered search, notifications, and user menu.
 */
export default function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotificationsStore();

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  const displayName = useMemo(() => {
    const metaName =
      auth?.user?.user_metadata?.fullName ||
      auth?.user?.user_metadata?.name ||
      "";
    return String(metaName).trim();
  }, [auth?.user?.user_metadata]);

  const initials = useMemo(() => {
    const email = auth?.user?.email ? String(auth.user.email) : "";
    const nameSource = displayName || email || "User";
    const parts = nameSource
      .replace(/@.*$/, "")
      .split(/[.\s_-]+/)
      .filter(Boolean);
    const a = (parts[0] || "U").slice(0, 1).toUpperCase();
    const b = (parts[1] || "").slice(0, 1).toUpperCase();
    return `${a}${b}`.trim() || "U";
  }, [displayName, auth?.user?.email]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close dropdown on outside click / Escape, and on route change.
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!menuOpen) return;
      const t = e.target;
      if (!t) return;

      const menuEl = menuRef.current;
      const btnEl = menuButtonRef.current;
      if (menuEl?.contains(t) || btnEl?.contains(t)) return;

      closeMenu();
    }

    function onKeyDown(e) {
      if (!menuOpen) return;
      if (e.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  const onSubmitSearch = useCallback(
    (e) => {
      e.preventDefault();
      const q = query.trim();
      // Minimal integration: route to /jobs and pass query via URL param.
      // JobsPage can optionally read this later without breaking anything now.
      navigate(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
    },
    [navigate, query]
  );

  const onClickNotifications = useCallback(() => {
    navigate("/notifications");
  }, [navigate]);

  const onLogout = useCallback(async () => {
    await auth.logout();
    navigate("/login");
  }, [auth, navigate]);

  // Settings route may not exist yet; we degrade gracefully to dashboard.
  const onGoSettings = useCallback(() => {
    navigate("/settings", { replace: false });
  }, [navigate]);

  const onGoProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  return (
    <header className="topbar" role="banner">
      <div className="container topbar-inner topbar-grid">
        <Link className="brand" to="/dashboard" aria-label="Talenvia Home">
          <span className="brand-badge" aria-hidden="true">
            T
          </span>
          <span className="brand-text">Talenvia</span>
        </Link>

        <form
          className="topbar-search"
          role="search"
          aria-label="Job search"
          onSubmit={onSubmitSearch}
        >
          <input
            className="input topbar-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, companies, roles…"
            aria-label="Search jobs, companies, roles"
          />
        </form>

        <div className="topbar-actions" aria-label="User actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onClickNotifications}
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >
            <span className="icon" aria-hidden="true">
              🔔
            </span>
            {unreadCount > 0 ? (
              <span className="badge" aria-hidden="true">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </button>

          {auth.status === "authenticated" && auth.user ? (
            <div className="user-menu">
              <button
                type="button"
                className="avatar-btn"
                ref={menuButtonRef}
                aria-label="Open user menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen ? "true" : "false"}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="avatar" aria-hidden="true">
                  {initials}
                </span>
              </button>

              {menuOpen ? (
                <div className="dropdown" role="menu" ref={menuRef}>
                  <div className="dropdown-header">
                    <div className="dropdown-name">
                      {displayName || "My account"}
                    </div>
                    <div className="dropdown-sub">
                      {auth.user.email || ""}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={onGoProfile}
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={onGoSettings}
                  >
                    Settings
                  </button>

                  <div className="dropdown-sep" role="separator" />

                  <button
                    type="button"
                    className="dropdown-item danger"
                    role="menuitem"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
