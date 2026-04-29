import { describe, it, expect } from 'vitest';
import { levelFromXp, badgeMaterial, tradesUnlockedForLevel } from './villager_profession_levels';

describe('villager profession levels', () => {
  it('zero xp novice', () => {
    expect(levelFromXp(0)).toBe('novice');
  });

  it('250 xp master', () => {
    expect(levelFromXp(250)).toBe('master');
  });

  it('badges progress stone → iron → gold → emerald → diamond per wiki', () => {
    expect(badgeMaterial('novice')).toBe('stone');
    expect(badgeMaterial('apprentice')).toBe('iron');
    expect(badgeMaterial('journeyman')).toBe('gold');
    expect(badgeMaterial('expert')).toBe('emerald');
    expect(badgeMaterial('master')).toBe('diamond');
  });

  it('master unlocks more trades', () => {
    expect(tradesUnlockedForLevel('master')).toBeGreaterThan(tradesUnlockedForLevel('novice'));
  });

  it('intermediate xp lands in tier', () => {
    expect(levelFromXp(100)).toBe('journeyman');
  });
});
