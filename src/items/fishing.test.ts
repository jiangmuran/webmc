import { describe, it, expect } from 'vitest';
import { FISHING_DROPS, poolWeightsFor, rollFishing, waitTime } from './fishing';

describe('fishing', () => {
  it('has all three loot pools', () => {
    const pools = new Set(FISHING_DROPS.map((d) => d.pool));
    expect(pools.has('fish')).toBe(true);
    expect(pools.has('treasure')).toBe(true);
    expect(pools.has('junk')).toBe(true);
  });

  it('fish is the most common pool without luck', () => {
    const w = poolWeightsFor(0);
    expect(w.fish).toBeGreaterThan(w.treasure);
    expect(w.fish).toBeGreaterThan(w.junk);
  });

  it('luck of the sea raises treasure, lowers junk', () => {
    const w0 = poolWeightsFor(0);
    const w3 = poolWeightsFor(3);
    expect(w3.treasure).toBeGreaterThan(w0.treasure);
    expect(w3.junk).toBeLessThan(w0.junk);
  });

  it('rollFishing returns a valid drop', () => {
    const drop = rollFishing(0, () => 0.05);
    expect(drop.item).toBeTruthy();
  });

  it('wait time scales down with lure enchant', () => {
    const t0 = waitTime(() => 0.5, 0);
    const t3 = waitTime(() => 0.5, 3);
    expect(t3).toBeLessThanOrEqual(t0);
  });

  it('wait time never below 1s', () => {
    for (let i = 0; i < 10; i++) {
      expect(waitTime(() => 0, 99)).toBeGreaterThanOrEqual(1);
    }
  });
});
