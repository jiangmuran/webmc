// Auth token validation. Optional — if the host server enables auth,
// peers must present a valid token signed by the shared secret. Tokens
// are HMAC-SHA256 over <issuedAt>|<uuid>|<name>, with an expiry.

export interface AuthToken {
  issuedAtMs: number;
  expiresAtMs: number;
  uuid: string;
  name: string;
  signature: string; // base64
}

export interface ValidateQuery {
  token: AuthToken;
  nowMs: number;
  sharedSecret: string;
  // `signer` computes the expected signature; injected so tests can use
  // a deterministic stub instead of a real HMAC.
  signer: (secret: string, payload: string) => string;
}

export interface ValidateResult {
  valid: boolean;
  reason?: 'expired' | 'bad_signature' | 'future';
}

function payloadString(t: AuthToken): string {
  return `${t.issuedAtMs.toString()}|${t.uuid}|${t.name}|${t.expiresAtMs.toString()}`;
}

export function validateToken(q: ValidateQuery): ValidateResult {
  if (q.nowMs < q.token.issuedAtMs - 60_000) {
    return { valid: false, reason: 'future' };
  }
  if (q.nowMs >= q.token.expiresAtMs) {
    return { valid: false, reason: 'expired' };
  }
  const expected = q.signer(q.sharedSecret, payloadString(q.token));
  if (expected !== q.token.signature) {
    return { valid: false, reason: 'bad_signature' };
  }
  return { valid: true };
}

export function issueToken(
  uuid: string,
  name: string,
  nowMs: number,
  ttlMs: number,
  sharedSecret: string,
  signer: (secret: string, payload: string) => string,
): AuthToken {
  const issuedAtMs = nowMs;
  const expiresAtMs = nowMs + ttlMs;
  const base = { issuedAtMs, expiresAtMs, uuid, name, signature: '' };
  const sig = signer(sharedSecret, payloadString(base));
  return { ...base, signature: sig };
}

// Default 4-hour TTL.
export const DEFAULT_TOKEN_TTL_MS = 4 * 60 * 60 * 1000;
