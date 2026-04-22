import { describe, it, expect } from 'vitest';
import { randomTick, harvestYield } from './amethyst_crystal_growth';

describe('amethyst crystal growth', () => {
  it('cluster terminal', () => {
    expect(randomTick('cluster', () => 0)).toBe('cluster');
  });

  it('advances on low roll', () => {
    expect(randomTick('small_bud', () => 0)).toBe('medium_bud');
  });

  it('holds on high roll', () => {
    expect(randomTick('small_bud', () => 0.9)).toBe('small_bud');
  });

  it('non-cluster yields 0', () => {
    expect(harvestYield('large_bud', 3, false)).toBe(0);
  });

  it('cluster silk touch 1', () => {
    expect(harvestYield('cluster', 0, true)).toBe(1);
  });

  it('cluster drops at least 4', () => {
    expect(harvestYield('cluster', 0, false)).toBeGreaterThanOrEqual(4);
  });
});
