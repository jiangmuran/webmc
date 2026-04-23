import { describe, it, expect } from 'vitest';
import {
  rollWild,
  breedChild,
  SPEED_MIN,
  SPEED_MAX,
  JUMP_MIN,
  JUMP_MAX,
  HEALTH_MIN,
  HEALTH_MAX,
} from './horse_speed_stat';

describe('horse speed stat', () => {
  it('wild roll in ranges', () => {
    for (let i = 0; i < 50; i++) {
      const s = rollWild(Math.random);
      expect(s.speed).toBeGreaterThanOrEqual(SPEED_MIN);
      expect(s.speed).toBeLessThanOrEqual(SPEED_MAX);
      expect(s.jumpStrength).toBeGreaterThanOrEqual(JUMP_MIN);
      expect(s.jumpStrength).toBeLessThanOrEqual(JUMP_MAX);
      expect(s.maxHealth).toBeGreaterThanOrEqual(HEALTH_MIN);
      expect(s.maxHealth).toBeLessThanOrEqual(HEALTH_MAX);
    }
  });

  it('child averages with drift', () => {
    const a = { speed: 0.2, jumpStrength: 0.5, maxHealth: 20 };
    const b = { speed: 0.3, jumpStrength: 0.8, maxHealth: 28 };
    const c = breedChild(a, b, () => 0.5);
    expect(c.speed).toBeGreaterThanOrEqual(SPEED_MIN);
    expect(c.speed).toBeLessThanOrEqual(SPEED_MAX);
  });
});
