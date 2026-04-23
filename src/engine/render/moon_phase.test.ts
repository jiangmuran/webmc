import { describe, it, expect } from 'vitest';
import { phaseForDay, lightBoostForMobSpawning, textureAtlasOffset, PHASE_COUNT } from './moon_phase';

describe('moon phase', () => {
  it('day 0 → phase 0', () => {
    expect(phaseForDay(0)).toBe(0);
  });

  it('cycle wraps', () => {
    expect(phaseForDay(PHASE_COUNT)).toBe(0);
  });

  it('full moon boosts spawning', () => {
    expect(lightBoostForMobSpawning(0)).toBeGreaterThan(0);
    expect(lightBoostForMobSpawning(4)).toBe(0);
  });

  it('atlas offset in [0,1)', () => {
    expect(textureAtlasOffset(0)).toBe(0);
    expect(textureAtlasOffset(PHASE_COUNT - 1)).toBeLessThan(1);
  });
});
