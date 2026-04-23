import { describe, it, expect } from 'vitest';
import { reduction, mitigatedDamage } from './projectile_protection';

describe('projectile protection', () => {
  it('base case', () => {
    expect(reduction(0)).toBe(0);
  });

  it('mitigates arrow damage', () => {
    expect(mitigatedDamage(10, 4)).toBeLessThan(10);
  });

  it('non-negative', () => {
    expect(mitigatedDamage(0, 4)).toBe(0);
  });

  it('level cap', () => {
    expect(reduction(100)).toBe(reduction(4));
  });
});
