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

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
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

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = await auth.register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });

      // If email confirmation is enabled, Supabase returns no session until confirmed.
      // In that case we keep the existing UX: redirect to login with a success banner.
      if (!data?.session) {
        navigate("/login?registered=1", { replace: true });
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

            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting || auth.status === "authenticating"}
              style={{ width: "100%" }}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div style={{ marginTop: 14, fontSize: 13 }} className="muted">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
