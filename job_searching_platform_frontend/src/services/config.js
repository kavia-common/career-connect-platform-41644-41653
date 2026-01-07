/**
 * Central place for runtime configuration.
 * CRA exposes env vars prefixed with REACT_APP_ at build time.
 */
export const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "";
