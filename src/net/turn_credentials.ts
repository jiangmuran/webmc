// TURN credentials rotation. Long-term credentials expire; server
// issues time-limited username/password pairs.

export interface TurnCredential {
  username: string;
  password: string;
  expiresAtMs: number;
  urls: string[];
}

export const DEFAULT_VALIDITY_MS = 24 * 60 * 60 * 1000; // 24h

export function isExpired(c: TurnCredential, nowMs: number): boolean {
  return nowMs >= c.expiresAtMs;
}

export function shouldRotateSoon(c: TurnCredential, nowMs: number, bufferMs = 5_000): boolean {
  return nowMs + bufferMs >= c.expiresAtMs;
}

export function mintCredential(
  secret: string,
  validityMs: number,
  nowMs: number,
  urls: string[],
): TurnCredential {
  const exp = Math.floor((nowMs + validityMs) / 1000);
  const username = `${exp}:webmc`;
  const password = hmacShort(secret, username);
  return { username, password, expiresAtMs: nowMs + validityMs, urls };
}

function hmacShort(secret: string, input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  for (let i = 0; i < secret.length; i++) h = (h * 17 + secret.charCodeAt(i)) | 0;
  return `pw_${(h >>> 0).toString(36)}`;
}
