import { describe, it, expect } from 'vitest';
import { treasureChance, junkChance, rollCategory } from './fishing_rod_reel_drops';

describe('fishing rod reel drops', () => {
  const base = {
    luckOfSeaLevel: 0,
    rainInBiome: false,
    openWaterBonus: true,
    rng: () => 0.5,
  };

  it('luck boosts treasure', () => {
    expect(treasureChance({ ...base, luckOfSeaLevel: 3 })).toBeGreaterThan(treasureChance(base));
  });

  it('luck reduces junk', () => {
    expect(junkChance({ ...base, luckOfSeaLevel: 3 })).toBeLessThan(junkChance(base));
  });

  it('high roll = fish', () => {
    expect(rollCategory({ ...base, rng: () => 0.99 })).toBe('fish');
  });

  it('low roll = junk', () => {
    expect(rollCategory({ ...base, rng: () => 0 })).toBe('junk');
  });
});
