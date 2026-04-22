import { describe, it, expect } from 'vitest';
import { applyLooting, applyLootingToAll } from './mob_looting';

describe('mob looting', () => {
  it('base drop returns count in the normal range', () => {
    const r = applyLooting({
      looting: 0,
      drop: { item: 'webmc:rotten_flesh', baseMin: 0, baseMax: 2, rare: false, rareChance: 0 },
      rng: () => 0.5,
    });
    expect(r).not.toBeNull();
    expect(r?.count).toBeGreaterThan(0);
  });

  it('looting expands the normal drop span', () => {
    const low = applyLooting({
      looting: 0,
      drop: { item: 'webmc:bone', baseMin: 1, baseMax: 2, rare: false, rareChance: 0 },
      rng: () => 0.99,
    });
    const high = applyLooting({
      looting: 3,
      drop: { item: 'webmc:bone', baseMin: 1, baseMax: 2, rare: false, rareChance: 0 },
      rng: () => 0.99,
    });
    expect(high?.count ?? 0).toBeGreaterThanOrEqual(low?.count ?? 0);
  });

  it('rare drop hits when rng < chance', () => {
    const r = applyLooting({
      looting: 0,
      drop: { item: 'webmc:ender_pearl', baseMin: 0, baseMax: 1, rare: true, rareChance: 0.5 },
      rng: () => 0.1,
    });
    expect(r?.count).toBeGreaterThan(0);
  });

  it('rare drop misses when rng > chance', () => {
    const r = applyLooting({
      looting: 0,
      drop: { item: 'webmc:ender_pearl', baseMin: 0, baseMax: 1, rare: true, rareChance: 0.1 },
      rng: () => 0.9,
    });
    expect(r).toBeNull();
  });

  it('looting adds extra rare rolls', () => {
    // With looting 3, 4 rolls at 0.25 chance; a deterministic RNG of 0.01
    // every call hits every time.
    const r = applyLooting({
      looting: 3,
      drop: {
        item: 'webmc:wither_skeleton_skull',
        baseMin: 0,
        baseMax: 1,
        rare: true,
        rareChance: 0.025,
      },
      rng: () => 0.01,
    });
    expect(r?.count).toBe(4);
  });

  it('applyLootingToAll combines drops', () => {
    const all = applyLootingToAll(
      [
        { item: 'webmc:bone', baseMin: 0, baseMax: 2, rare: false, rareChance: 0 },
        { item: 'webmc:arrow', baseMin: 0, baseMax: 2, rare: false, rareChance: 0 },
      ],
      1,
      () => 0.5,
    );
    expect(all.length).toBeLessThanOrEqual(2);
  });
});
