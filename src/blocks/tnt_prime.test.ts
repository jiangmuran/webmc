import { describe, it, expect } from 'vitest';
import { primeTnt, tickTnt, FUSE_TICKS } from './tnt_prime';

describe('tnt', () => {
  it('flint gives full fuse', () => {
    expect(primeTnt('flint_and_steel', false).fuseTicks).toBe(FUSE_TICKS);
  });

  it('chained explosion prime shorter', () => {
    const t = primeTnt('explosion', false);
    expect(t.fuseTicks).toBeGreaterThanOrEqual(10);
    expect(t.fuseTicks).toBeLessThan(31);
  });

  it('tick down to explode', () => {
    const t = primeTnt('flint_and_steel', false);
    for (let i = 0; i < FUSE_TICKS - 1; i++) {
      expect(tickTnt(t).exploded).toBe(false);
    }
    expect(tickTnt(t).exploded).toBe(true);
  });

  it('water suppresses blast', () => {
    const t = primeTnt('flint_and_steel', true);
    for (let i = 0; i < FUSE_TICKS - 1; i++) tickTnt(t);
    expect(tickTnt(t)).toEqual({ exploded: true, suppressed: true });
  });
});
