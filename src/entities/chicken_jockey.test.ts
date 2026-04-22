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

  it('baby chance', () => {
    expect(shouldBeJockey({ babyZombieSpawning: true, rand: () => 0 })).toBe(true);
    expect(shouldBeJockey({ babyZombieSpawning: true, rand: () => JOCKEY_CHANCE + 0.01 })).toBe(
      false,
    );
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
