import { describe, it, expect } from 'vitest';
import {
  scheduleHatch,
  readyToHatch,
  hatchCount,
  breaksWithoutWater,
  FROGSPAWN_MIN_HATCH_TICKS,
  FROGSPAWN_MAX_HATCH_TICKS,
  TADPOLES_PER_SPAWN_MIN,
  TADPOLES_PER_SPAWN_MAX,
} from './frogspawn_hatch';

describe('frogspawn hatch', () => {
  it('schedules within range', () => {
    for (let i = 0; i < 50; i++) {
      const h = scheduleHatch(0, Math.random);
      expect(h).toBeGreaterThanOrEqual(FROGSPAWN_MIN_HATCH_TICKS);
      expect(h).toBeLessThanOrEqual(FROGSPAWN_MAX_HATCH_TICKS);
    }
  });

  it('not ready early', () => {
    expect(readyToHatch({ hatchAtTick: 1000, waterBelow: true }, 500)).toBe(false);
  });

  it('ready at time', () => {
    expect(readyToHatch({ hatchAtTick: 1000, waterBelow: true }, 1000)).toBe(true);
  });

  it('not ready dry', () => {
    expect(readyToHatch({ hatchAtTick: 1000, waterBelow: false }, 2000)).toBe(false);
  });

  it('hatch count range', () => {
    for (let i = 0; i < 50; i++) {
      const n = hatchCount(Math.random);
      expect(n).toBeGreaterThanOrEqual(TADPOLES_PER_SPAWN_MIN);
      expect(n).toBeLessThanOrEqual(TADPOLES_PER_SPAWN_MAX);
    }
  });

  it('breaks dry', () => {
    expect(breaksWithoutWater({ hatchAtTick: 0, waterBelow: false })).toBe(true);
  });
});
