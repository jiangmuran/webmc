import { describe, it, expect } from 'vitest';
import { offersUnlocked, tierFor, tierIndex } from './villager_levels';

describe('villager levels', () => {
  it('fresh villager is novice', () => {
    expect(tierFor(0)).toBe('novice');
  });

  it('progresses through tiers with xp', () => {
    expect(tierFor(10)).toBe('apprentice');
    expect(tierFor(70)).toBe('journeyman');
    expect(tierFor(150)).toBe('expert');
    expect(tierFor(250)).toBe('master');
  });

  it('tier index orders 0..4', () => {
    expect(tierIndex('novice')).toBe(0);
    expect(tierIndex('master')).toBe(4);
  });

  it('offers unlocked grows monotonically', () => {
    expect(offersUnlocked('novice')).toBeLessThan(offersUnlocked('master'));
  });
});
