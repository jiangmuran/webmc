import { describe, it, expect } from 'vitest';
import { primeTnt, tickTnt, FUSE_TICKS } from './tnt_prime';

describe('tnt', () => {
  it('flint gives full fuse', () => {
    expect(primeTnt('flint_and_steel', false).fuseTicks).toBe(FUSE_TICKS);
  });

  it('chained explosion prime shorter (10..30 ticks per wiki)', () => {
    // Wiki (minecraft.wiki/w/TNT): "If TNT is ignited by another
    // explosion, the fuse is randomized between 10 and 30 ticks."
    // Sample low and high RNG to verify span.
    expect(primeTnt('explosion', false, () => 0).fuseTicks).toBe(10);
    expect(primeTnt('explosion', false, () => 0.999).fuseTicks).toBe(30);
    expect(primeTnt('explosion', false, () => 0.5).fuseTicks).toBe(20);
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
