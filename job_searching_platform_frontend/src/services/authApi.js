/**
 * This module previously implemented backend JWT auth via /auth/login and /auth/register.
 *
 * Supabase Auth is now used for authentication in the frontend:
 * - Login: supabase.auth.signInWithPassword
 * - Register: supabase.auth.signUp
 * - Session: supabase.auth.getSession + onAuthStateChange
 *
 * If the project later needs to call a custom backend auth service again,
 * reintroduce functions here and keep UI code calling the AuthProvider methods.
 */

// PUBLIC_INTERFACE
export function authApiDeprecated() {
  /** Placeholder to keep a stable module shape if anything imports it indirectly. */
  throw new Error(
    "authApi is deprecated: Supabase Auth is now used. Use src/state/authStore.js instead."
  );
}
