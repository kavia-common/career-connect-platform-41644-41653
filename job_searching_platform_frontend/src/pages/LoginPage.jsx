import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../services/config";
import { useAuth } from "../state/authStore";
import { isValidEmail, validatePassword } from "../utils/validators";

/**
 * PUBLIC_INTERFACE
 * LoginPage for Talenvia.
 */
export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("returnTo") || "/dashboard";
  }, [location.search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const errors = { email: "", password: "" };

    if (!email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";

    if (!password) errors.password = "Password is required.";
    else errors.password = validatePassword(password);

    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    try {
      await auth.login({ email: email.trim(), password });
      navigate(returnTo, { replace: true });
    } catch (err) {
      // err shape normalized by httpClient: { code, message, details, status }
      const message =
        err?.code === "UNAUTHORIZED"
          ? "Invalid email or password."
          : err?.message || "Login failed. Please try again.";
      setSubmitError(message);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 16px" }}>
      <div
        className="card"
        style={{
          maxWidth: 520,
          margin: "0 auto",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="card-body">
          <div style={{ display: "grid", gap: 6, marginBottom: 18 }}>
            <h1 className="h1">Welcome back</h1>
            <div className="muted">
              Sign in to continue to your Talenvia dashboard.
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              API base:{" "}
              <code>{API_BASE || "(REACT_APP_API_BASE not set)"}</code>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={fieldErrors.email ? "true" : "false"}
              />
              {fieldErrors.email ? (
                <div className="form-error">{fieldErrors.email}</div>
              ) : null}
            </div>

            <div className="form-row">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={fieldErrors.password ? "true" : "false"}
              />
              {fieldErrors.password ? (
                <div className="form-error">{fieldErrors.password}</div>
              ) : null}
            </div>

            {submitError ? (
              <div
                className="card"
                style={{
                  borderColor: "rgba(220, 38, 38, 0.35)",
                  background: "rgba(220, 38, 38, 0.06)",
                  marginBottom: 12,
                }}
              >
                <div className="card-body" style={{ color: "var(--color-danger)" }}>
                  {submitError}
                </div>
              </div>
            ) : null}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={auth.status === "authenticating"}
              style={{ width: "100%" }}
            >
              {auth.status === "authenticating" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{ marginTop: 14, fontSize: 13 }} className="muted">
            Don’t have an account yet?{" "}
            <Link to="/login" aria-disabled="true" onClick={(e) => e.preventDefault()}>
              Register (coming soon)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
