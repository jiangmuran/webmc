import { describe, it, expect } from 'vitest';
import { pickVariant, hasDrownedSpawner, isBuriedInSand } from './ocean_ruins';

describe('ocean ruins gen', () => {
  it('warm big', () => {
    expect(pickVariant({ isWarm: true, rng: () => 0.1 })).toBe('warm_big');
  });

  it('warm small', () => {
    expect(pickVariant({ isWarm: true, rng: () => 0.9 })).toBe('warm_small');
  });

  it('cold big', () => {
    expect(pickVariant({ isWarm: false, rng: () => 0.1 })).toBe('cold_big');
  });

  it('cold small', () => {
    expect(pickVariant({ isWarm: false, rng: () => 0.9 })).toBe('cold_small');
  });

  it('drowned sometimes', () => {
    expect(hasDrownedSpawner({ isWarm: true, rng: () => 0.1 })).toBe(true);
    expect(hasDrownedSpawner({ isWarm: true, rng: () => 0.9 })).toBe(false);
  });

  it('buried sometimes', () => {
    expect(isBuriedInSand({ isWarm: true, rng: () => 0.1 })).toBe(true);
  });
});
