import { http } from "./httpClient";

/**
 * PUBLIC_INTERFACE
 * Register using POST /auth/register.
 * @param {{ email: string, password: string, fullName: string }} payload
 * @returns {Promise<{ user: any, accessToken: string, refreshToken?: string }>}
 */
export async function register(payload) {
  return http.post("/auth/register", payload);
}

/**
 * PUBLIC_INTERFACE
 * Login using POST /auth/login.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ user: any, accessToken: string, refreshToken?: string }>}
 */
export async function login(payload) {
  return http.post("/auth/login", payload);
}

/**
 * PUBLIC_INTERFACE
 * Fetch the current user using GET /auth/me.
 * @returns {Promise<{ user: any }>}
 */
export async function me() {
  return http.get("/auth/me");
}
