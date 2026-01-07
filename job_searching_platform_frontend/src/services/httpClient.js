import { API_BASE } from "./config";

/**
 * @typedef {Object} ApiErrorPayload
 * @property {{ code?: string, message?: string, details?: any }} [error]
 */

/**
 * @typedef {Object} NormalizedApiError
 * @property {string} code
 * @property {string} message
 * @property {any} [details]
 * @property {number} [status]
 */

/**
 * Safely join API base with a path.
 * Ensures we don't create double slashes.
 */
function joinUrl(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

function readJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Convert various server error forms into a stable shape for UI.
 * Matches docs/api.md "Standard error shape".
 * @param {Response} res
 * @param {string} bodyText
 * @returns {NormalizedApiError}
 */
function normalizeError(res, bodyText) {
  /** @type {ApiErrorPayload | any} */
  const parsed = readJsonSafely(bodyText);

  const code =
    parsed?.error?.code ||
    (res.status === 401 ? "UNAUTHORIZED" : `HTTP_${res.status}`);

  const message =
    parsed?.error?.message ||
    parsed?.message ||
    res.statusText ||
    "Request failed";

  return {
    code,
    message,
    details: parsed?.error?.details ?? parsed?.details,
    status: res.status,
  };
}

/**
 * The app's authentication is handled by Supabase Auth, not by a custom JWT stored
 * as "talenvia.accessToken".
 *
 * For now, backend API calls remain unauthenticated (placeholders) until a backend
 * is integrated with Supabase JWT verification or another strategy.
 *
 * If/when the backend expects Supabase access tokens, update this to:
 * - read the current session from supabase.auth.getSession()
 * - attach Authorization: Bearer <session.access_token>
 */
function getAccessToken() {
  return "";
}

function handleUnauthorized() {
  // No-op for now (Supabase handles session state separately).
}

/**
 * PUBLIC_INTERFACE
 * Typed-ish request helper for JSON APIs.
 * @param {string} path
 * @param {{ method?: string, body?: any, headers?: Record<string, string>, signal?: AbortSignal }} [options]
 * @returns {Promise<any>}
 */
export async function requestJson(path, options = {}) {
  const url = API_BASE ? joinUrl(API_BASE, path) : path;

  const token = getAccessToken();
  const headers = {
    ...(options.headers || {}),
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const bodyText = await res.text();

  if (!res.ok) {
    const err = normalizeError(res, bodyText);
    if (res.status === 401) handleUnauthorized();
    throw err;
  }

  // Some endpoints may return 204
  if (!bodyText) return null;

  const parsed = readJsonSafely(bodyText);
  return parsed !== null ? parsed : bodyText;
}

/**
 * PUBLIC_INTERFACE
 * Convenience wrappers.
 */
export const http = {
  /** @param {string} path */
  get: (path) => requestJson(path, { method: "GET" }),
  /** @param {string} path @param {any} body */
  post: (path, body) => requestJson(path, { method: "POST", body }),
  /** @param {string} path @param {any} body */
  put: (path, body) => requestJson(path, { method: "PUT", body }),
  /** @param {string} path */
  del: (path) => requestJson(path, { method: "DELETE" }),
};
