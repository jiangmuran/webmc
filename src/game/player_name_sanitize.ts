// Player name validation. Alphanumeric + underscore; 3-16 chars.
// Strip whitespace; collapse repeated underscores.

export const MIN_NAME_LEN = 3;
export const MAX_NAME_LEN = 16;
const VALID_RE = /^[A-Za-z0-9_]{3,16}$/;

export function sanitize(raw: string): string {
  let s = raw.trim().replace(/\s+/g, '_');
  s = s.replace(/_+/g, '_');
  s = s.replace(/[^A-Za-z0-9_]/g, '');
  return s.slice(0, MAX_NAME_LEN);
}

export function isValid(name: string): boolean {
  return VALID_RE.test(name);
}

export function toLowerKey(name: string): string {
  return name.toLowerCase();
}

export function namesEqual(a: string, b: string): boolean {
  return toLowerKey(a) === toLowerKey(b);
}
