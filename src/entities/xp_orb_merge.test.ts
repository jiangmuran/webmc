import { describe, it, expect } from 'vitest';
import { canMerge, mergeInto, withinPickup, splitXp, type XpOrb } from './xp_orb_merge';

function orb(id: number, x: number, y: number, z: number, value: number): XpOrb {
  return { id, x, y, z, value, ageTicks: 0 };
}

describe('xp orb merge', () => {
  it('merges when near', () => {
    expect(canMerge(orb(1, 0, 0, 0, 3), orb(2, 0.2, 0, 0, 5))).toBe(true);
  });

  it('does not merge when far', () => {
    expect(canMerge(orb(1, 0, 0, 0, 3), orb(2, 5, 0, 0, 5))).toBe(false);
  });

  it('self-merge rejected', () => {
    const o = orb(1, 0, 0, 0, 3);
    expect(canMerge(o, o)).toBe(false);
  });

  it('mergeInto sums values', () => {
    const a = orb(1, 0, 0, 0, 3);
    a.ageTicks = 50;
    const b = orb(2, 0, 0, 0, 5);
    b.ageTicks = 20;
    mergeInto(a, b);
    expect(a.value).toBe(8);
    expect(a.ageTicks).toBe(20);
  });

  it('pickup range', () => {
    expect(withinPickup(orb(1, 0, 0, 0, 1), 0.5, 0, 0)).toBe(true);
    expect(withinPickup(orb(1, 0, 0, 0, 1), 2, 0, 0)).toBe(false);
  });

  it('split sums back', () => {
    for (const amt of [1, 7, 100, 1000, 5000, 12345]) {
      const parts = splitXp(amt);
      expect(parts.reduce((a, b) => a + b, 0)).toBe(amt);
    }
  });

  it('split 0 = empty', () => {
    expect(splitXp(0)).toEqual([]);
  });
});
