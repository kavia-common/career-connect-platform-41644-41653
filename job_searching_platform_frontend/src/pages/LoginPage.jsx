import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/authStore";
import { isValidEmail, validatePassword } from "../utils/validators";

/**
 * PUBLIC_INTERFACE
 * LoginPage for Talenvia (Supabase Auth).
 */
export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("returnTo") || "/dashboard";
  }, [location.search]);

  const registered = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("registered") === "1";
  }, [location.search]);

  const verifyEmailBanner = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("verifyEmail") === "1";
  }, [location.search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const [submitError, setSubmitError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const [resendStatus, setResendStatus] = useState("idle"); // idle | sending | sent | error
  const [resendMessage, setResendMessage] = useState("");

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
    setNeedsVerification(false);
    setResendMessage("");
    setResendStatus("idle");

    if (!validate()) return;

    try {
      await auth.login({ email: email.trim(), password });
      navigate(returnTo, { replace: true });
    } catch (err) {
      if (err?.code === "EMAIL_NOT_CONFIRMED") {
        setNeedsVerification(true);
        setSubmitError(err?.message);
        return;
      }

      const message =
        err?.code === "UNAUTHORIZED"
          ? "Invalid email or password."
          : err?.message || "Login failed. Please try again.";
      setSubmitError(message);
    }
  };

  const onResendVerification = async () => {
    setResendMessage("");
    setResendStatus("sending");
    try {
      await auth.resendVerificationEmail(email);
      setResendStatus("sent");
      setResendMessage(
        "Verification email sent. Please check your inbox (and spam folder)."
      );
    } catch (err) {
      setResendStatus("error");
      setResendMessage(err?.message || "Could not resend verification email.");
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
          </div>

          {registered ? (
            <div
              className="card"
              style={{
                borderColor: "rgba(5, 150, 105, 0.30)",
                background: "rgba(5, 150, 105, 0.06)",
                marginBottom: 12,
              }}
            >
              <div
                className="card-body"
                style={{ color: "var(--color-success)" }}
              >
                Account created. You can sign in now.
              </div>
            </div>
          ) : null}

          {verifyEmailBanner ? (
            <div
              className="card"
              style={{
                borderColor: "rgba(55, 65, 81, 0.22)",
                background: "rgba(55, 65, 81, 0.06)",
                marginBottom: 12,
              }}
            >
              <div className="card-body">
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  Verify your email to continue
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  We sent a verification email when you signed up. Please click
                  the link in your inbox, then return here to sign in.
                </div>
              </div>
            </div>
          ) : null}

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
                  borderColor: needsVerification
                    ? "rgba(55, 65, 81, 0.22)"
                    : "rgba(220, 38, 38, 0.35)",
                  background: needsVerification
                    ? "rgba(55, 65, 81, 0.06)"
                    : "rgba(220, 38, 38, 0.06)",
                  marginBottom: 12,
                }}
              >
                <div
                  className="card-body"
                  style={{
                    color: needsVerification
                      ? "var(--color-text)"
                      : "var(--color-danger)",
                  }}
                >
                  {submitError}
                  {needsVerification ? (
                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      <div className="muted" style={{ fontSize: 13 }}>
                        Didn’t receive the email? You can resend it below.
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={onResendVerification}
                          disabled={
                            resendStatus === "sending" || !email.trim()
                          }
                        >
                          {resendStatus === "sending"
                            ? "Sending…"
                            : "Resend verification email"}
                        </button>
                      </div>

                      {resendMessage ? (
                        <div
                          style={{
                            fontSize: 13,
                            color:
                              resendStatus === "sent"
                                ? "var(--color-success)"
                                : resendStatus === "error"
                                  ? "var(--color-danger)"
                                  : "var(--color-text-muted)",
                          }}
                          role="status"
                        >
                          {resendMessage}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                auth.status === "authenticating" || resendStatus === "sending"
              }
              style={{ width: "100%" }}
            >
              {auth.status === "authenticating" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div style={{ marginTop: 14, fontSize: 13 }} className="muted">
            Don’t have an account yet? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
