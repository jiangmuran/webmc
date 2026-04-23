import { describe, it, expect } from 'vitest';
import { isInvulnerable, explodesOnSpawnEnd } from './wither_invulnerable_phase';

describe('wither invulnerable phase', () => {
  it('invul while charging', () => {
    expect(isInvulnerable({ hpPercent: 1, spawnTicksRemaining: 100 })).toBe(true);
  });

  it('vulnerable after', () => {
    expect(isInvulnerable({ hpPercent: 1, spawnTicksRemaining: 0 })).toBe(false);
  });

  it('last tick explodes', () => {
    expect(explodesOnSpawnEnd({ hpPercent: 1, spawnTicksRemaining: 1 })).toBe(true);
  });
});
