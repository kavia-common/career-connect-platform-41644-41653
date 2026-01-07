import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/authStore";

/**
 * PUBLIC_INTERFACE
 * Navbar: top navigation bar with brand + quick search + user actions.
 */
export default function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  const onLogout = useCallback(() => {
    auth.logout();
    navigate("/login");
  }, [auth, navigate]);

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link className="brand" to="/dashboard" aria-label="Talenvia Home">
          <span className="brand-badge">T</span>
          Talenvia
        </Link>

        <div className="searchbar" aria-label="Global search">
          <input
            className="input"
            placeholder="Search jobs… (coming soon)"
            disabled
            aria-disabled="true"
          />
        </div>

        <button className="btn btn-secondary" onClick={toggleTheme}>
          Theme: {theme}
        </button>

        {auth.status === "authenticated" ? (
          <button className="btn btn-primary" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}
