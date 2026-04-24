import { describe, it, expect } from 'vitest';
import { levelFromXp, badgeMaterial, tradesUnlockedForLevel } from './villager_profession_levels';

describe('villager profession levels', () => {
  it('zero xp novice', () => {
    expect(levelFromXp(0)).toBe('novice');
  });

  it('250 xp master', () => {
    expect(levelFromXp(250)).toBe('master');
  });

  it('badges increase', () => {
    expect(badgeMaterial('master')).toBe('netherite');
    expect(badgeMaterial('novice')).toBe('stone');
  });

  it('master unlocks more trades', () => {
    expect(tradesUnlockedForLevel('master')).toBeGreaterThan(tradesUnlockedForLevel('novice'));
  });

  it('apprentice badge gold', () => {
    expect(badgeMaterial('apprentice')).toBe('gold');
  });

  it('intermediate xp lands in tier', () => {
    expect(levelFromXp(100)).toBe('journeyman');
  });
});
