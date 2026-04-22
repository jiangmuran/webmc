import { describe, it, expect } from 'vitest';
import { clampedRegional, enchantedGearChance, regionalDifficulty } from './difficulty_per_player';

describe('regional difficulty', () => {
  it('peaceful is always 0', () => {
    const r = regionalDifficulty({
      difficulty: 'peaceful',
      worldTimeSec: 1000000,
      chunkInhabitedSec: 1000000,
    });
    expect(r).toBe(0);
  });

  it('fresh easy world is ~0.75', () => {
    const r = regionalDifficulty({
      difficulty: 'easy',
      worldTimeSec: 0,
      chunkInhabitedSec: 0,
    });
    expect(r).toBeCloseTo(0.75);
  });

  it('old hard chunk approaches cap', () => {
    const r = regionalDifficulty({
      difficulty: 'hard',
      worldTimeSec: 10000000,
      chunkInhabitedSec: 10000000,
    });
    expect(r).toBeGreaterThan(5);
    expect(r).toBeLessThanOrEqual(6.75);
  });

  it('clampedRegional stays in [0, 1]', () => {
    const c = clampedRegional({
      difficulty: 'hard',
      worldTimeSec: 1000000,
      chunkInhabitedSec: 1000000,
    });
    expect(c).toBeGreaterThanOrEqual(0);
    expect(c).toBeLessThanOrEqual(1);
  });

  it('enchant gear chance scales', () => {
    const low = enchantedGearChance({
      difficulty: 'easy',
      worldTimeSec: 0,
      chunkInhabitedSec: 0,
    });
    const high = enchantedGearChance({
      difficulty: 'hard',
      worldTimeSec: 1e9,
      chunkInhabitedSec: 1e9,
    });
    expect(high).toBeGreaterThan(low);
  });
});
