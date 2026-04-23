import { describe, it, expect } from 'vitest';
import { damageReduction, burnTimeReduction } from './fire_protection';

describe('fire protection', () => {
  it('0 at L0', () => {
    expect(damageReduction(0)).toBe(0);
  });

  it('scales with level', () => {
    expect(damageReduction(4)).toBeGreaterThan(damageReduction(1));
  });

  it('burn reduced proportionally', () => {
    expect(burnTimeReduction(4)).toBeGreaterThan(0);
  });

  it('burn clamps at 1', () => {
    expect(burnTimeReduction(100)).toBe(1);
  });
});
