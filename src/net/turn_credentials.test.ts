import { describe, it, expect } from 'vitest';
import {
  mintCredential,
  isExpired,
  shouldRotateSoon,
  DEFAULT_VALIDITY_MS,
} from './turn_credentials';

describe('turn credentials', () => {
  it('new cred not expired', () => {
    const c = mintCredential('secret', DEFAULT_VALIDITY_MS, 1000, ['turn:example']);
    expect(isExpired(c, 1000)).toBe(false);
  });

  it('expires at deadline', () => {
    const c = mintCredential('secret', 1000, 0, []);
    expect(isExpired(c, 2000)).toBe(true);
  });

  it('rotate soon when near expiry', () => {
    const c = mintCredential('s', 60_000, 0, []);
    expect(shouldRotateSoon(c, 58_000)).toBe(true);
    expect(shouldRotateSoon(c, 0)).toBe(false);
  });

  it('same inputs → same cred', () => {
    const a = mintCredential('s', 1000, 0, []);
    const b = mintCredential('s', 1000, 0, []);
    expect(a.password).toBe(b.password);
  });
});
