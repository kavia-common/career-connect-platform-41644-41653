/**
 * PUBLIC_INTERFACE
 * Basic email format validation.
 * @param {string} email
 */
export function isValidEmail(email) {
  const value = (email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * PUBLIC_INTERFACE
 * Basic password validation (MVP): non-empty and min length.
 * @param {string} password
 */
export function validatePassword(password) {
  const value = password || "";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return "";
}
