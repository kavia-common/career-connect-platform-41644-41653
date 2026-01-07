/**
 * Utilities for persisting the user's profile locally.
 * Note: This is a temporary persistence layer. Can be swapped to Supabase later.
 *
 * The profile shape may evolve over time; callers should avoid relying on removed fields
 * (e.g., the deprecated `website` field).
 */

const STORAGE_KEY = "talenvia.profile.v1";

/**
 * PUBLIC_INTERFACE
 * loadProfile loads the user's saved profile from localStorage.
 *
 * @returns {object|null} The stored profile object, or null if none/invalid.
 */
export function loadProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * saveProfile saves the user's profile to localStorage.
 *
 * @param {object} profile - Profile data to persist.
 * @returns {boolean} True if saved, false otherwise.
 */
export function saveProfile(profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile ?? {}));
    return true;
  } catch {
    return false;
  }
}

/**
 * PUBLIC_INTERFACE
 * clearProfile removes the locally stored profile.
 */
export function clearProfile() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
