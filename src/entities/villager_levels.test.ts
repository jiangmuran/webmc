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

  it('Java offer counts 2/4/6/8/10 per wiki', () => {
    // Wiki (minecraft.wiki/w/Trading): "Java: villagers have a
    // maximum of 10 trades. Each level unlocks a maximum of two new
    // trades." Old table added 1 per level (2/3/4/5/6) — wrong, and
    // capped masters at 6 instead of 10.
    expect(offersUnlocked('novice')).toBe(2);
    expect(offersUnlocked('apprentice')).toBe(4);
    expect(offersUnlocked('journeyman')).toBe(6);
    expect(offersUnlocked('expert')).toBe(8);
    expect(offersUnlocked('master')).toBe(10);
  });
});
