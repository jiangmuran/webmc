import { describe, it, expect } from 'vitest';
import { DEFAULT_TOKEN_TTL_MS, issueToken, validateToken } from './auth_token';

// Deterministic test signer: returns secret:payload.
const TEST_SIGNER = (secret: string, payload: string): string => `${secret}:${payload}`;

describe('auth token', () => {
  it('valid issue + validate round-trips', () => {
    const t = issueToken('u1', 'alice', 1000, DEFAULT_TOKEN_TTL_MS, 's', TEST_SIGNER);
    const r = validateToken({
      token: t,
      nowMs: 2000,
      sharedSecret: 's',
      signer: TEST_SIGNER,
    });
    expect(r.valid).toBe(true);
  });

  it('expired token rejected', () => {
    const t = issueToken('u1', 'alice', 1000, 500, 's', TEST_SIGNER);
    const r = validateToken({
      token: t,
      nowMs: 2000,
      sharedSecret: 's',
      signer: TEST_SIGNER,
    });
    expect(r.reason).toBe('expired');
  });

  it('future token (clock skew > 1min)', () => {
    const t = issueToken('u1', 'alice', 1_000_000, DEFAULT_TOKEN_TTL_MS, 's', TEST_SIGNER);
    const r = validateToken({
      token: t,
      nowMs: 0,
      sharedSecret: 's',
      signer: TEST_SIGNER,
    });
    expect(r.reason).toBe('future');
  });

  it('bad signature rejected', () => {
    const t = issueToken('u1', 'alice', 1000, DEFAULT_TOKEN_TTL_MS, 's', TEST_SIGNER);
    const r = validateToken({
      token: { ...t, signature: 'forged' },
      nowMs: 2000,
      sharedSecret: 's',
      signer: TEST_SIGNER,
    });
    expect(r.reason).toBe('bad_signature');
  });

  it('wrong secret rejected', () => {
    const t = issueToken('u1', 'alice', 1000, DEFAULT_TOKEN_TTL_MS, 's', TEST_SIGNER);
    const r = validateToken({
      token: t,
      nowMs: 2000,
      sharedSecret: 'different',
      signer: TEST_SIGNER,
    });
    expect(r.reason).toBe('bad_signature');
  });
});
