import { describe, it, expect } from 'vitest';
import {
  isActive,
  rollNextDelay,
  atMobCap,
  SPAWN_DELAY_MIN,
  SPAWN_DELAY_MAX,
} from './spawner_activation_range';

describe('spawner activation', () => {
  it('active within range', () => {
    expect(isActive(10)).toBe(true);
    expect(isActive(20)).toBe(false);
  });

  it('delay in range', () => {
    for (let i = 0; i < 20; i++) {
      const d = rollNextDelay(() => 0.5);
      expect(d).toBeGreaterThanOrEqual(SPAWN_DELAY_MIN);
      expect(d).toBeLessThan(SPAWN_DELAY_MAX);
    }
  });

  it('cap at 6', () => {
    expect(atMobCap(6)).toBe(true);
    expect(atMobCap(5)).toBe(false);
  });
});
