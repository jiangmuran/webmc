import { describe, it, expect } from 'vitest';
import { endermiteSpawns, endermiteLifespanTicks } from './endermite_spawn_pearl';

describe('endermite spawn pearl', () => {
  it('no pearl no spawn', () => {
    expect(endermiteSpawns({ pearlTeleport: false, rng: () => 0 })).toBe(false);
  });

  it('lucky spawn', () => {
    expect(endermiteSpawns({ pearlTeleport: true, rng: () => 0 })).toBe(true);
  });

  it('unlucky skip', () => {
    expect(endermiteSpawns({ pearlTeleport: true, rng: () => 0.99 })).toBe(false);
  });

  it('has lifespan', () => {
    expect(endermiteLifespanTicks()).toBeGreaterThan(0);
  });
});
