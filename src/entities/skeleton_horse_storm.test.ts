import { describe, it, expect } from 'vitest';
import { shouldSpawnTrap, onPlayerApproach, TRAP_RIDER_COUNT } from './skeleton_horse_storm';

describe('skeleton horse storm', () => {
  it('no trap without thunder', () => {
    expect(
      shouldSpawnTrap({
        thundering: false,
        difficulty: 'hard',
        regionalDifficulty: 1,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('no trap on easy', () => {
    expect(
      shouldSpawnTrap({
        thundering: true,
        difficulty: 'easy',
        regionalDifficulty: 1,
        rand: () => 0,
      }),
    ).toBe(false);
  });

  it('rare spawn on tiny roll', () => {
    expect(
      shouldSpawnTrap({
        thundering: true,
        difficulty: 'hard',
        regionalDifficulty: 3,
        rand: () => 0,
      }),
    ).toBe(true);
  });

  it('approach triggers lightning + 4 riders', () => {
    expect(onPlayerApproach()).toEqual({ lightning: true, riders: TRAP_RIDER_COUNT });
  });
});
