import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/authStore";
import { isValidEmail, validatePassword } from "../utils/validators";

/**
 * PUBLIC_INTERFACE
 * RegisterPage for Talenvia (Supabase Auth).
 */
export default function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("registered") === "1";
  }, [location.search]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification UX state
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);
  const [verifyBannerEmail, setVerifyBannerEmail] = useState("");

  const [resendStatus, setResendStatus] = useState("idle"); // idle | sending | sent | error
  const [resendMessage, setResendMessage] = useState("");

  // If already authenticated, keep users out of public auth pages.
  useEffect(() => {
    if (auth.status === "authenticated" && auth.session && auth.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.status, auth.session, auth.user, navigate]);

  const validate = () => {
    const errors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!fullName.trim()) errors.fullName = "Name is required.";

    if (!email.trim()) errors.email = "Email is required.";
    else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";

    if (!password) errors.password = "Password is required.";
    else errors.password = validatePassword(password);

    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password)
      errors.confirmPassword = "Passwords do not match.";

    setFieldErrors(errors);
    return (
      !errors.fullName &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setShowVerifyBanner(false);
    setVerifyBannerEmail("");
    setResendStatus("idle");
    setResendMessage("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const cleanedEmail = email.trim();

      const data = await auth.register({
        email: cleanedEmail,
        password,
        fullName: fullName.trim(),
      });

      // If email confirmation is enabled, Supabase returns no session until confirmed.
      // NEW UX: show explicit banner here and allow resend; also provide a CTA to go to login.
      if (!data?.session) {
        setShowVerifyBanner(true);
        setVerifyBannerEmail(cleanedEmail);
        return;
      }

      // Session exists: user is signed in.
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.code === "VALIDATION_ERROR"
          ? err?.message || "Please check your details and try again."
          : err?.message || "Registration failed. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResendVerification = async () => {
    setResendStatus("sending");
    setResendMessage("");
    try {
      const targetEmail = (verifyBannerEmail || email || "").trim();
      await auth.resendVerificationEmail(targetEmail);
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
          maxWidth: 560,
          margin: "0 auto",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="card-body">
          <div style={{ display: "grid", gap: 6, marginBottom: 18 }}>
            <h1 className="h1">Create your account</h1>
            <div className="muted">
              Register to access your dashboard and start tracking applications.
            </div>
          </div>

          {successFromQuery ? (
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

          {showVerifyBanner ? (
            <div
              className="card"
              style={{
                borderColor: "rgba(55, 65, 81, 0.22)",
                background: "rgba(55, 65, 81, 0.06)",
                marginBottom: 12,
              }}
            >
              <div className="card-body">
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  Check your inbox to verify your email
                </div>
                <div className="muted" style={{ fontSize: 13 }}>
                  We sent a verification link to{" "}
                  <span style={{ fontWeight: 700, color: "var(--color-text)" }}>
                    {verifyBannerEmail}
                  </span>
                  . Click that link to activate your account, then sign in.
                </div>

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={onResendVerification}
                    disabled={resendStatus === "sending"}
                  >
                    {resendStatus === "sending"
                      ? "Sending…"
                      : "Resend verification email"}
                  </button>

                  <Link
                    className="btn btn-primary"
                    to={`/login?verifyEmail=1&registered=1`}
                    style={{ textDecoration: "none", display: "inline-block" }}
                  >
                    Go to sign in
                  </Link>
                </div>

                {resendMessage ? (
                  <div
                    style={{
                      marginTop: 10,
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
            </div>
          ) : null}

          <form onSubmit={onSubmit} noValidate aria-label="register-form">
            <div className="form-row">
              <label className="label" htmlFor="fullName">
                Name
              </label>
              <input
                id="fullName"
                className="input"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                aria-invalid={fieldErrors.fullName ? "true" : "false"}
                disabled={showVerifyBanner}
              />
              {fieldErrors.fullName ? (
                <div className="form-error">{fieldErrors.fullName}</div>
              ) : null}
            </div>

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
                disabled={showVerifyBanner}
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={fieldErrors.password ? "true" : "false"}
                disabled={showVerifyBanner}
              />
              {fieldErrors.password ? (
                <div className="form-error">{fieldErrors.password}</div>
              ) : null}
            </div>

            <div className="form-row">
              <label className="label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                className="input"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
                disabled={showVerifyBanner}
              />
              {fieldErrors.confirmPassword ? (
                <div className="form-error">{fieldErrors.confirmPassword}</div>
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
                <div
                  className="card-body"
                  style={{ color: "var(--color-danger)" }}
                >
                  {submitError}
                </div>
              </div>
            ) : null}

            {!showVerifyBanner ? (
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting || auth.status === "authenticating"}
                style={{ width: "100%" }}
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </button>
            ) : null}
          </form>

          <div style={{ marginTop: 14, fontSize: 13 }} className="muted">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
