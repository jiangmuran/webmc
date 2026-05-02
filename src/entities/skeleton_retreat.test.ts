import { describe, it, expect } from 'vitest';
import { makeSkelAim, planMove, dropBowChance, OPTIMAL_MIN, OPTIMAL_MAX } from './skeleton_retreat';

describe('skeleton retreat', () => {
  it('retreat when too close', () => {
    const s = makeSkelAim();
    expect(planMove(s, { distance: OPTIMAL_MIN - 1, losBlocked: false, nowMs: 0 })).toBe('retreat');
  });

  it('close when too far', () => {
    const s = makeSkelAim();
    expect(planMove(s, { distance: OPTIMAL_MAX + 1, losBlocked: false, nowMs: 0 })).toBe('close');
  });

  it('strafe in optimal range', () => {
    const s = makeSkelAim();
    expect(planMove(s, { distance: 12, losBlocked: false, nowMs: 0 })).toBe('strafe');
  });

  it('no LOS = close', () => {
    const s = makeSkelAim();
    expect(planMove(s, { distance: 30, losBlocked: true, nowMs: 0 })).toBe('close');
  });

  it('bow drop chance scales 8.5% + 1%/level (wiki)', () => {
    // Looting III: 8.5 + 3 = 11.5%
    expect(dropBowChance({ lootingLevel: 3, rand: () => 0.114 })).toBe(true);
    expect(dropBowChance({ lootingLevel: 3, rand: () => 0.116 })).toBe(false);
    // No looting: 8.5%
    expect(dropBowChance({ lootingLevel: 0, rand: () => 0.084 })).toBe(true);
    expect(dropBowChance({ lootingLevel: 0, rand: () => 0.086 })).toBe(false);
  });
});
