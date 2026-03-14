/**
 * Pure validation helpers (no toast/side effects). Use in UI and show toast on false.
 */

/** GitHub username: 1-39 chars, alphanumeric + single hyphens, no leading/trailing/consecutive hyphen, no slash. */
export function isValidGithubUsername(username: string): boolean {
  if (!username) return true;
  if (username.length > 39) return false;
  if (username.startsWith('-') || username.endsWith('-')) return false;
  if (username.includes('--')) return false;
  if (username.includes('/')) return false;
  if (!/^[a-zA-Z0-9-]+$/.test(username)) return false;
  return true;
}

/** LinkedIn username: 5-30 chars, letters/digits/hyphen/underscore, must not start/end with - or _. */
export function isValidLinkedinUsername(username: string): boolean {
  if (!username) return true;
  if (username.length < 5 || username.length > 30) return false;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{3,28}[a-zA-Z0-9]$/.test(username)) return false;
  return true;
}

/** Returns true if email is a valid .edu address (ends with .edu). */
export function isValidEduEmail(email: string): boolean {
  return email.endsWith('.edu');
}
