import { describe, it, expect } from 'vitest';
import { makeOcelot, feed, trusts, MAX_TRUST, SCARE_RADIUS_CREEPER } from './ocelot_trust_advance';

describe('ocelot trust', () => {
  it('non-fish rejected', () => {
    const o = makeOcelot();
    expect(feed(o, { item: 'webmc:apple', nowMs: 1000, rand: () => 0 })).toBe('rejected');
  });

  it('fish accepted with progress', () => {
    const o = makeOcelot();
    expect(feed(o, { item: 'webmc:cod', nowMs: 1000, rand: () => 0 })).toBe('accepted');
    expect(o.trust).toBe(1);
  });

  it('cooldown', () => {
    const o = makeOcelot();
    feed(o, { item: 'webmc:cod', nowMs: 0, rand: () => 0 });
    expect(feed(o, { item: 'webmc:cod', nowMs: 100, rand: () => 0 })).toBe('cooldown');
  });

  it('trust caps', () => {
    const o = { trust: MAX_TRUST, lastFedMs: -Infinity };
    expect(trusts(o)).toBe(true);
    expect(feed(o, { item: 'webmc:cod', nowMs: 1000, rand: () => 0 })).toBe('trusted');
  });

  it('scare radius', () => {
    expect(SCARE_RADIUS_CREEPER).toBeGreaterThan(0);
  });
});
