import { describe, it, expect } from 'vitest';
import {
  shouldDig,
  isEmerging,
  DIG_EMERGE_TICKS,
  INVESTIGATION_TIMEOUT,
  INITIAL_HEALTH,
} from './warden_dig_spawn';

describe('warden dig spawn', () => {
  it('digs after timeout with no target', () => {
    expect(shouldDig({ ticksEmerged: 1000, ticksSinceAnyStimulus: INVESTIGATION_TIMEOUT })).toBe(
      true,
    );
  });

  it('does not dig while engaged', () => {
    expect(
      shouldDig({
        ticksEmerged: 1000,
        ticksSinceAnyStimulus: INVESTIGATION_TIMEOUT,
        currentTarget: 'alice',
      }),
    ).toBe(false);
  });

  it('emerge lasts 225 ticks', () => {
    expect(isEmerging({ ticksEmerged: 0, ticksSinceAnyStimulus: 0 })).toBe(true);
    expect(isEmerging({ ticksEmerged: DIG_EMERGE_TICKS, ticksSinceAnyStimulus: 0 })).toBe(false);
  });

  it('initial health 500', () => {
    expect(INITIAL_HEALTH).toBe(500);
  });
});
