import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/authStore";

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute enforces authenticated access to nested routes.
 */
export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === "authenticating") {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">Signing you in…</div>
        </div>
      </div>
    );
  }

  if (auth.status !== "authenticated" || !auth.accessToken) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  return children;
}
