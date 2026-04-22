import { describe, it, expect } from 'vitest';
import {
  pickPool,
  pickFromPool,
  FISH_POOL,
  TREASURE_POOL,
  JUNK_POOL,
} from './fishing_treasure_table';

describe('fishing catch', () => {
  it('fish dominant', () => {
    expect(pickPool({ luckOfTheSeaLevel: 0, rand: () => 0.5 })).toBe('fish');
  });

  it('treasure on low roll', () => {
    expect(pickPool({ luckOfTheSeaLevel: 0, rand: () => 0.01 })).toBe('treasure');
  });

  it('junk', () => {
    expect(pickPool({ luckOfTheSeaLevel: 0, rand: () => 0.08 })).toBe('junk');
  });

  it('luck raises treasure', () => {
    // with luck III, treasure chance > 0.1
    const hit = pickPool({ luckOfTheSeaLevel: 3, rand: () => 0.08 });
    expect(hit).toBe('treasure');
  });

  it('pick item deterministic', () => {
    const a = pickFromPool(FISH_POOL, () => 0.1);
    const b = pickFromPool(FISH_POOL, () => 0.1);
    expect(a).toBe(b);
  });

  it('treasure pool not empty', () => {
    expect(TREASURE_POOL.length).toBeGreaterThan(0);
    expect(JUNK_POOL.length).toBeGreaterThan(0);
  });
});
