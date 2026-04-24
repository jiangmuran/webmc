import { describe, it, expect } from 'vitest';
import { fangLine, fangCircle } from './evoker_fang_summon';

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
});
