import { describe, it, expect } from 'vitest';
import { canMerge, merge, expired, LIFETIME_TICKS, type XpOrb } from './experience_orb_merge';

const a: XpOrb = { id: 'a', value: 3, x: 0, y: 0, z: 0, ageTicks: 0 };
const b: XpOrb = { id: 'b', value: 5, x: 0.2, y: 0, z: 0, ageTicks: 10 };

describe('experience orb merge', () => {
  it('close different orbs merge', () => {
    expect(canMerge(a, b)).toBe(true);
  });

  it('same id no self-merge', () => {
    expect(canMerge(a, a)).toBe(false);
  });

  it('far orbs do not merge', () => {
    const far = { ...b, x: 5 };
    expect(canMerge(a, far)).toBe(false);
  });

  it('merge sums value', () => {
    expect(merge(a, b).value).toBe(8);
  });

  it('merge keeps younger age', () => {
    expect(merge(a, b).ageTicks).toBe(0);
  });

  it('expires after lifetime', () => {
    expect(expired({ ...a, ageTicks: LIFETIME_TICKS })).toBe(true);
  });

  it('still alive before limit', () => {
    expect(expired(a)).toBe(false);
  });
});
