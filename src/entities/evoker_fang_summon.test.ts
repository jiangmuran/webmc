import { describe, it, expect } from 'vitest';
import {
  fangLine,
  fangCircle,
  fangCirclesAround,
  FANG_INNER_RING_COUNT,
  FANG_OUTER_RING_COUNT,
  FANG_INNER_RADIUS,
  FANG_OUTER_RADIUS,
} from './evoker_fang_summon';

describe('evoker fang summon', () => {
  it('line count matches', () => {
    const f = fangLine({ casterX: 0, casterZ: 0, targetX: 10, targetZ: 0, patternLength: 8 });
    expect(f).toHaveLength(8);
  });

  it('line delays stagger', () => {
    const f = fangLine({ casterX: 0, casterZ: 0, targetX: 10, targetZ: 0, patternLength: 3 });
    expect(f[0]?.delayTicks).toBeLessThan(f[2]?.delayTicks ?? 0);
  });

  it('circle radius 2', () => {
    const f = fangCircle({ casterX: 0, casterZ: 0, targetX: 0, targetZ: 0, patternLength: 0 });
    expect(f[0] && Math.hypot(f[0].x, f[0].z)).toBeCloseTo(2);
  });

  it('circle count default 12', () => {
    expect(
      fangCircle({ casterX: 0, casterZ: 0, targetX: 0, targetZ: 0, patternLength: 0 }),
    ).toHaveLength(12);
  });

  it('zero direction safe', () => {
    const f = fangLine({ casterX: 0, casterZ: 0, targetX: 0, targetZ: 0, patternLength: 2 });
    expect(Number.isFinite(f[0]?.x ?? NaN)).toBe(true);
  });

  it('two circles: inner 5 fangs + outer 8 fangs (wiki)', () => {
    const f = fangCirclesAround({
      casterX: 0,
      casterZ: 0,
      targetX: 0,
      targetZ: 0,
      patternLength: 0,
    });
    expect(f).toHaveLength(FANG_INNER_RING_COUNT + FANG_OUTER_RING_COUNT);
    expect(FANG_INNER_RING_COUNT).toBe(5);
    expect(FANG_OUTER_RING_COUNT).toBe(8);

    // First 5 fangs are at FANG_INNER_RADIUS, next 8 at FANG_OUTER_RADIUS.
    for (let i = 0; i < 5; i++) {
      const fang = f[i];
      expect(fang).toBeDefined();
      if (fang) {
        expect(Math.hypot(fang.x, fang.z)).toBeCloseTo(FANG_INNER_RADIUS);
      }
    }
    for (let i = 5; i < 13; i++) {
      const fang = f[i];
      expect(fang).toBeDefined();
      if (fang) {
        expect(Math.hypot(fang.x, fang.z)).toBeCloseTo(FANG_OUTER_RADIUS);
      }
    }
  });
});
