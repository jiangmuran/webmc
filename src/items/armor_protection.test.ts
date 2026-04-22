import { describe, it, expect } from 'vitest';
import {
  reducedDamage,
  protectionEpf,
  blastProtectionEpf,
  featherFallingEpf,
} from './armor_protection';

describe('armor reduction', () => {
  it('no armor = full damage', () => {
    expect(reducedDamage(10, { armor: 0, toughness: 0, epf: 0 })).toBe(10);
  });

  it('armor reduces damage', () => {
    expect(reducedDamage(10, { armor: 10, toughness: 0, epf: 0 })).toBeLessThan(10);
  });

  it('epf further reduces', () => {
    const noEpf = reducedDamage(10, { armor: 10, toughness: 0, epf: 0 });
    const withEpf = reducedDamage(10, { armor: 10, toughness: 0, epf: 10 });
    expect(withEpf).toBeLessThan(noEpf);
  });

  it('epf clamped at 20', () => {
    const a = reducedDamage(10, { armor: 5, toughness: 0, epf: 20 });
    const b = reducedDamage(10, { armor: 5, toughness: 0, epf: 100 });
    expect(a).toBeCloseTo(b);
  });

  it('never negative', () => {
    expect(reducedDamage(5, { armor: 20, toughness: 2, epf: 20 })).toBeGreaterThanOrEqual(0);
  });
});

describe('epf helpers', () => {
  it('protection is 1x', () => {
    expect(protectionEpf(4)).toBe(4);
  });
  it('blast only counts for explosions', () => {
    expect(blastProtectionEpf(4, false)).toBe(0);
    expect(blastProtectionEpf(4, true)).toBe(8);
  });
  it('feather falling is 3x', () => {
    expect(featherFallingEpf(4, true)).toBe(12);
  });
});
