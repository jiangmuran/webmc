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

  it('Easy difficulty CAN spawn trap horse (wiki: Java)', () => {
    // Wiki: rate scales by regional difficulty. With regionalDifficulty
    // 1 the rate is 0.75% — a rng of 0 still triggers.
    expect(
      shouldSpawnTrap({
        thundering: true,
        difficulty: 'easy',
        regionalDifficulty: 1,
        rand: () => 0,
      }),
    ).toBe(true);
  });

  it('zero regional difficulty → no trap', () => {
    expect(
      shouldSpawnTrap({
        thundering: true,
        difficulty: 'easy',
        regionalDifficulty: 0,
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
