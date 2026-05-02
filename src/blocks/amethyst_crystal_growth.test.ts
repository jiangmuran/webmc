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

  it('Fortune III ore-formula avg ≈ 8.8 (wiki)', () => {
    let total = 0;
    const N = 5000;
    for (let i = 0; i < N; i++) {
      total += harvestYield('cluster', 3, false, Math.random);
    }
    const avg = total / N;
    // Wiki: average is 4 × 2.2 = 8.8 shards. Allow ±5% tolerance.
    expect(avg).toBeGreaterThan(8.0);
    expect(avg).toBeLessThan(9.6);
  });

  it('Fortune III deterministic boundaries', () => {
    // rand=0   → roll=-1 → multiplier=1 → 4 shards
    expect(harvestYield('cluster', 3, false, () => 0)).toBe(4);
    // rand close to 1 → roll=3 → multiplier=4 → 16 shards
    expect(harvestYield('cluster', 3, false, () => 0.999)).toBe(16);
  });
});
