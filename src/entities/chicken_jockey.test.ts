import { describe, it, expect } from 'vitest';
import {
  shouldBeJockey,
  hatchIntoJockey,
  shouldSkeletonJockey,
  JOCKEY_CHANCE,
} from './chicken_jockey';

describe('chicken jockey', () => {
  it('adult zombie never jockey', () => {
    expect(shouldBeJockey({ babyZombieSpawning: false, rand: () => 0 })).toBe(false);
  });

  it('baby chance is 4.75% (wiki)', () => {
    expect(JOCKEY_CHANCE).toBe(0.0475);
    // rng below 4.75% → jockey
    expect(shouldBeJockey({ babyZombieSpawning: true, rand: () => 0.04 })).toBe(true);
    // rng above 4.75% → no jockey (catches the old 5% off-by-rounding)
    expect(shouldBeJockey({ babyZombieSpawning: true, rand: () => 0.048 })).toBe(false);
  });

  it('hatch gated by depth', () => {
    expect(hatchIntoJockey(100, () => 0)).toBe(false);
    expect(hatchIntoJockey(20, () => 0)).toBe(true);
  });

  it('skeleton jockey requires thunder', () => {
    expect(shouldSkeletonJockey(false, () => 0)).toBe(false);
    expect(shouldSkeletonJockey(true, () => 0)).toBe(true);
  });
});
