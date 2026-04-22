import { describe, it, expect } from 'vitest';
import { boneMealMoss } from './moss_spread';

describe('moss spread', () => {
  it('no replaceable blocks → no placements', () => {
    const out = boneMealMoss(
      { x: 0, y: 64, z: 0 },
      { isMossReplaceable: () => false, hasAirAbove: () => true },
    );
    expect(out.length).toBe(0);
  });

  it('covers a dirt patch with moss + decoration', () => {
    const out = boneMealMoss(
      { x: 0, y: 64, z: 0 },
      { isMossReplaceable: () => true, hasAirAbove: () => true },
      () => 0.1,
    );
    expect(out.length).toBeGreaterThan(0);
    expect(out.some((p) => p.block === 'webmc:moss_block')).toBe(true);
  });

  it('respects the 3-block horizontal radius', () => {
    const out = boneMealMoss(
      { x: 0, y: 64, z: 0 },
      { isMossReplaceable: () => true, hasAirAbove: () => true },
      () => 0.1,
    );
    for (const p of out) {
      expect(Math.hypot(p.pos.x, p.pos.z)).toBeLessThanOrEqual(4);
    }
  });
});
