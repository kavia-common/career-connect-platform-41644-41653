import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../services/supabaseClient";

/**
 * NOTE:
 * We intentionally remove the old localStorage "talenvia.accessToken" logic.
 * Supabase Auth persists its session internally (localStorage) and provides
 * access to the session via getSession / onAuthStateChange.
 */

const AuthContext = createContext(null);

/**
 * Map Supabase auth errors into a stable UI-consumable shape similar to the previous
 * httpClient normalization, so existing UI error handling remains simple.
 * @param {any} err
 */
function normalizeSupabaseAuthError(err) {
  const message = err?.message || "Authentication failed. Please try again.";
  const status = err?.status;

  // Provide a small set of stable-ish codes for UI branching.
  const code =
    status === 400 || status === 401
      ? "UNAUTHORIZED"
      : err?.code || "AUTH_ERROR";

  return { code, message, status };
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider powered by Supabase Auth.
 *
 * Exposes:
 * - status: "authenticating" | "authenticated" | "anonymous"
 * - loading: boolean (alias for initial hydration / auth transitions)
 * - session: Supabase session or null
 * - user: Supabase user or null
 * - login({email,password})
 * - register({email,password,fullName})
 * - logout()
 */
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // Hydrate session on mount and subscribe to changes.
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!isMounted) return;
        setSession(data?.session || null);
        setUser(data?.session?.user || null);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[Auth] Failed to hydrate Supabase session:", e);
        if (!isMounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    hydrate();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // onAuthStateChange will also update state; we set it eagerly for snappy UX.
      setSession(data?.session || null);
      setUser(data?.session?.user || null);

      return data;
    } catch (e) {
      throw normalizeSupabaseAuthError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ email, password, fullName }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Store display name in metadata (no DB table changes required for this task).
          data: { fullName: fullName || "" },
        },
      });
      if (error) throw error;

      // If email confirmations are enabled, session may be null until confirmed.
      setSession(data?.session || null);
      setUser(data?.session?.user || data?.user || null);

      return data;
    } catch (e) {
      throw normalizeSupabaseAuthError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
    } catch (e) {
      // Even if signOut fails, clear local state so UI doesn't get stuck.
      setSession(null);
      setUser(null);
      // eslint-disable-next-line no-console
      console.warn("[Auth] signOut failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const status = useMemo(() => {
    if (loading) return "authenticating";
    if (session?.user) return "authenticated";
    return "anonymous";
  }, [loading, session]);

  const value = useMemo(
    () => ({
      status,
      loading,
      session,
      user,
      login,
      register,
      logout,
    }),
    [status, loading, session, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access auth store.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
