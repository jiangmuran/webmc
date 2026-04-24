import { describe, it, expect } from 'vitest';
import {
  requiredCount,
  enoughPlayersSleeping,
  progressPercent,
  DEFAULT_PLAYERS_SLEEPING_PERCENTAGE,
} from './player_sleep_percent_skip';

describe('player sleep percent skip', () => {
  it('100% rule needs all', () => {
    expect(
      requiredCount({
        totalPlayers: 4,
        sleepingPlayers: 0,
        percentageGameRule: DEFAULT_PLAYERS_SLEEPING_PERCENTAGE,
      }),
    ).toBe(4);
  });

  it('50% rule needs half', () => {
    expect(requiredCount({ totalPlayers: 4, sleepingPlayers: 0, percentageGameRule: 50 })).toBe(2);
  });

  it('skips night when enough', () => {
    expect(
      enoughPlayersSleeping({ totalPlayers: 4, sleepingPlayers: 2, percentageGameRule: 50 }),
    ).toBe(true);
  });

  it('not enough still night', () => {
    expect(
      enoughPlayersSleeping({ totalPlayers: 4, sleepingPlayers: 1, percentageGameRule: 50 }),
    ).toBe(false);
  });

  it('progress percent increases', () => {
    const p = progressPercent({ totalPlayers: 4, sleepingPlayers: 1, percentageGameRule: 50 });
    expect(p).toBeGreaterThan(0);
  });

  it('progress maxes at 100', () => {
    expect(progressPercent({ totalPlayers: 4, sleepingPlayers: 99, percentageGameRule: 50 })).toBe(
      100,
    );
  });
});
