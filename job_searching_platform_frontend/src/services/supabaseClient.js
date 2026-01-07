import { createClient } from "@supabase/supabase-js";

/**
 * Central Supabase client instance for the app.
 *
 * CRA NOTE:
 * Create React App only exposes env vars prefixed with REACT_APP_ to the browser bundle.
 *
 * We standardize on:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY (Supabase anon/public key)
 *
 * Backwards-compatible fallbacks:
 * - SUPABASE_URL
 * - SUPABASE_KEY
 */

// Prefer CRA-exposed variables, but keep fallback for older setups/build tooling.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || "";

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_KEY || process.env.SUPABASE_KEY || "";

/**
 * Lightweight runtime checks:
 * - In production, we avoid noisy logs.
 * - In dev/test, we warn if config appears missing.
 */
const isProbablyMissing =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.trim() === "" ||
  supabaseAnonKey.trim() === "" ||
  supabaseUrl.includes("your-project") ||
  supabaseAnonKey.toLowerCase().includes("your-anon-key");

if (isProbablyMissing && process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.warn(
    [
      "[Supabase] Missing or placeholder Supabase configuration.",
      "Expected env vars:",
      "- REACT_APP_SUPABASE_URL (preferred) or SUPABASE_URL (fallback)",
      "- REACT_APP_SUPABASE_KEY (preferred) or SUPABASE_KEY (fallback)",
      "Auth features will not work until these are provided.",
    ].join("\n")
  );
}

/**
 * PUBLIC_INTERFACE
 * Supabase client used throughout the app.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
