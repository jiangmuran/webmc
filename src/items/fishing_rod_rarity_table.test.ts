import { describe, it, expect } from 'vitest';
import {
  poolWeights,
  pickPool,
  lureReducesTicks,
  LURE_TICK_REDUCTION_PER_LEVEL,
} from './fishing_rod_rarity_table';

describe('fishing rod rarity table', () => {
  it('base weighted toward fish', () => {
    const w = poolWeights(0);
    expect(w.fish).toBeGreaterThan(w.treasure);
    expect(w.fish).toBeGreaterThan(w.junk);
  });

  it('luck boosts treasure', () => {
    expect(poolWeights(3).treasure).toBeGreaterThan(poolWeights(0).treasure);
  });

  it('luck reduces junk', () => {
    expect(poolWeights(3).junk).toBeLessThan(poolWeights(0).junk);
  });

  it('small rng → fish', () => {
    expect(pickPool(poolWeights(0), () => 0.01)).toBe('fish');
  });

  it('large rng → junk', () => {
    expect(pickPool(poolWeights(0), () => 0.99)).toBe('junk');
  });

  it('lure reduces per level', () => {
    expect(lureReducesTicks(2)).toBe(LURE_TICK_REDUCTION_PER_LEVEL * 2);
  });

  it('zero lure no reduction', () => {
    expect(lureReducesTicks(0)).toBe(0);
  });
});
