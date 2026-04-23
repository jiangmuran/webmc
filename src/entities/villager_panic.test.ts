import { describe, it, expect } from 'vitest';
import {
  inPanic,
  runsToward,
  rememberAttacker,
  tickDown,
  PANIC_DURATION_TICKS,
} from './villager_panic';

describe('villager panic', () => {
  it('hostile triggers panic', () => {
    expect(
      inPanic({
        recentAttackTicks: 0,
        nearbyHostile: true,
        nearbyIronGolem: false,
        timeOfDayIsNight: false,
      }),
    ).toBe(true);
  });

  it('golem preferred refuge', () => {
    expect(
      runsToward({
        recentAttackTicks: 10,
        nearbyHostile: true,
        nearbyIronGolem: true,
        timeOfDayIsNight: false,
      }),
    ).toBe('iron_golem');
  });

  it('house fallback', () => {
    expect(
      runsToward({
        recentAttackTicks: 10,
        nearbyHostile: true,
        nearbyIronGolem: false,
        timeOfDayIsNight: false,
      }),
    ).toBe('house');
  });

  it('remember ≥ 100 ticks', () => {
    expect(rememberAttacker(50)).toBe(PANIC_DURATION_TICKS);
  });

  it('tick down to 0', () => {
    expect(tickDown(1)).toBe(0);
    expect(tickDown(0)).toBe(0);
  });
});
