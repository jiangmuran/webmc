import { describe, it, expect } from 'vitest';
import { requiredSleepers, shouldSkipNight, setTimeAfterSkip } from './sleep_skip_night';

describe('sleep skip night', () => {
  it('single player alone', () => {
    expect(requiredSleepers({ totalPlayers: 1, sleepingPlayers: 0, requiredFraction: 1.0 })).toBe(
      1,
    );
  });

  it('half of 4 players = 2', () => {
    expect(requiredSleepers({ totalPlayers: 4, sleepingPlayers: 0, requiredFraction: 0.5 })).toBe(
      2,
    );
  });

  it('enough sleepers skips', () => {
    expect(shouldSkipNight({ totalPlayers: 4, sleepingPlayers: 2, requiredFraction: 0.5 })).toBe(
      true,
    );
  });

  it('not enough sleepers', () => {
    expect(shouldSkipNight({ totalPlayers: 4, sleepingPlayers: 1, requiredFraction: 0.5 })).toBe(
      false,
    );
  });

  it('dawn time after skip', () => {
    expect(setTimeAfterSkip()).toBe(1000);
  });
});
