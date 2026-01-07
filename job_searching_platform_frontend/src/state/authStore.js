import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { login as loginApi } from "../services/authApi";

const STORAGE_TOKEN_KEY = "talenvia.accessToken";
const STORAGE_USER_KEY = "talenvia.user";

const AuthContext = createContext(null);

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readInitialState() {
  let token = "";
  let user = null;

  try {
    token = window.localStorage.getItem(STORAGE_TOKEN_KEY) || "";
    user = safeJsonParse(window.localStorage.getItem(STORAGE_USER_KEY) || "");
  } catch {
    // ignore storage errors
  }

  return {
    status: token ? "authenticated" : "anonymous",
    accessToken: token,
    user,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, status: "authenticating" };
    case "AUTH_SUCCESS":
      return {
        status: "authenticated",
        accessToken: action.payload.accessToken,
        user: action.payload.user,
      };
    case "AUTH_LOGOUT":
      return { status: "anonymous", accessToken: "", user: null };
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider for Talenvia.
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, readInitialState);

  const setAuth = useCallback((accessToken, user) => {
    try {
      window.localStorage.setItem(STORAGE_TOKEN_KEY, accessToken);
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    dispatch({ type: "AUTH_SUCCESS", payload: { accessToken, user } });
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_TOKEN_KEY);
      window.localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore
    }
    dispatch({ type: "AUTH_LOGOUT" });
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      dispatch({ type: "AUTH_START" });
      const res = await loginApi({ email, password });
      // Expected shape: { user, accessToken, refreshToken? }
      setAuth(res.accessToken, res.user);
      return res;
    },
    [setAuth]
  );

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      setAuth,
    }),
    [state, login, logout, setAuth]
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
