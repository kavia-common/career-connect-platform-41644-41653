import { createClient } from "@supabase/supabase-js";

/**
 * Central Supabase client instance for the app.
 *
 * IMPORTANT:
 * This project is a Create React App (CRA) bundle. CRA only exposes environment
 * variables prefixed with REACT_APP_ at build time. However, this task explicitly
 * requests using SUPABASE_URL and SUPABASE_KEY.
 *
 * This means your build environment must inject these variables in a CRA-compatible
 * way (e.g., via build tooling / deployment env injection). If you do not see them
 * at runtime, the client will be misconfigured.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] Missing SUPABASE_URL or SUPABASE_KEY env vars. Auth will not work until they are provided."
  );
}

/**
 * PUBLIC_INTERFACE
 * Supabase client used throughout the app.
 */
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
