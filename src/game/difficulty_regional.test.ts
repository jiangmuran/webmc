import { describe, it, expect } from 'vitest';
import { regionalDifficulty, clampedDifficulty } from './difficulty_regional';

describe('difficulty regional', () => {
  it('peaceful is 0', () => {
    expect(
      regionalDifficulty({
        chunkInhabitedTicks: 0,
        daysPlayed: 0,
        isMoonFull: false,
        baseDifficulty: 'peaceful',
      }),
    ).toBe(0);
  });

  it('hard is highest', () => {
    expect(
      regionalDifficulty({
        chunkInhabitedTicks: 100_000,
        daysPlayed: 100,
        isMoonFull: true,
        baseDifficulty: 'hard',
      }),
    ).toBeGreaterThan(3);
  });

  it('clamped under cap', () => {
    expect(
      clampedDifficulty({
        chunkInhabitedTicks: 1e9,
        daysPlayed: 1e9,
        isMoonFull: true,
        baseDifficulty: 'hard',
      }),
    ).toBeLessThanOrEqual(6.75);
  });
});
