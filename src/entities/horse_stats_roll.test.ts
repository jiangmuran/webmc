import { describe, it, expect } from 'vitest';
import { rollHorseStats, breed, jumpHeightBlocks } from './horse_stats_roll';

describe('horse stats', () => {
  it('stats within range', () => {
    for (let i = 0; i < 50; i++) {
      const seed = i / 50;
      const s = rollHorseStats(() => seed);
      expect(s.maxHealth).toBeGreaterThanOrEqual(15);
      expect(s.maxHealth).toBeLessThanOrEqual(32);
      expect(s.jumpStrength).toBeGreaterThanOrEqual(0.4);
      expect(s.speed).toBeGreaterThanOrEqual(0.1125);
    }
  });

  it('breeding averages parents', () => {
    const a = { maxHealth: 20, jumpStrength: 0.7, speed: 0.25 };
    const b = { maxHealth: 30, jumpStrength: 1, speed: 0.3 };
    const c = breed(a, b, () => 0.5);
    expect(c.maxHealth).toBeGreaterThan(15);
  });

  it('jump height positive for mid values', () => {
    expect(jumpHeightBlocks(0.7)).toBeGreaterThan(0);
  });
});
