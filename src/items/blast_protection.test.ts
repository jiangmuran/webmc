import { describe, it, expect } from 'vitest';
import { reduction, knockbackMultiplier, MAX_LEVEL } from './blast_protection';

describe('blast protection', () => {
  it('0 at L0', () => {
    expect(reduction(0)).toBe(0);
  });

  it('higher level more reduction', () => {
    expect(reduction(4)).toBeGreaterThan(reduction(1));
  });

  it('caps at MAX_LEVEL', () => {
    expect(reduction(MAX_LEVEL + 10)).toBe(reduction(MAX_LEVEL));
  });

  it('knockback reduced proportionally', () => {
    expect(knockbackMultiplier(4)).toBeLessThan(1);
    expect(knockbackMultiplier(0)).toBe(1);
  });

  it('knockback uses 15% per level, not 8% (wiki)', () => {
    // Wiki: "Java, Blast Protection has the side effect of reducing
    // knockback created from explosions by (15 × level)%"
    expect(knockbackMultiplier(1)).toBeCloseTo(0.85, 5);
    expect(knockbackMultiplier(2)).toBeCloseTo(0.7, 5);
    expect(knockbackMultiplier(3)).toBeCloseTo(0.55, 5);
    expect(knockbackMultiplier(4)).toBeCloseTo(0.4, 5);
  });

  it('knockback bottoms out at 0 across stacked levels', () => {
    // 15% × 7 = 105% reduction → clamp to 100% (multiplier 0).
    expect(knockbackMultiplier(7)).toBe(0);
    expect(knockbackMultiplier(20)).toBe(0);
  });
});
