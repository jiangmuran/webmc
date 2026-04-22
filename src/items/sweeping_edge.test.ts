import { describe, it, expect } from 'vitest';
import { sweepFraction, damageToSweepTarget, canSweep } from './sweeping_edge';

describe('sweeping edge', () => {
  it('fraction 0 at level 0', () => {
    expect(sweepFraction(0)).toBe(0);
  });

  it('level 3 = 75%', () => {
    expect(sweepFraction(3)).toBeCloseTo(0.75);
  });

  it('in-range target hit', () => {
    expect(damageToSweepTarget(8, 3, { distance: 0.5 })).toBeCloseTo(6);
  });

  it('out of range miss', () => {
    expect(damageToSweepTarget(8, 3, { distance: 2 })).toBe(0);
  });

  it('needs full cooldown', () => {
    expect(canSweep({ attackStrengthPct: 0.5, sprinting: false, critical: false })).toBe(false);
  });

  it('sprinting disables', () => {
    expect(canSweep({ attackStrengthPct: 1, sprinting: true, critical: false })).toBe(false);
  });

  it('critical disables', () => {
    expect(canSweep({ attackStrengthPct: 1, sprinting: false, critical: true })).toBe(false);
  });

  it('canonical sweep ok', () => {
    expect(canSweep({ attackStrengthPct: 1, sprinting: false, critical: false })).toBe(true);
  });
});
