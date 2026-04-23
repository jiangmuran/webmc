import { describe, it, expect } from 'vitest';
import { isResting, flightSpeed, WAKE_PLAYER_DISTANCE } from './bat_day_sleep';

describe('bat day sleep', () => {
  it('rests in day under ceiling', () => {
    expect(isResting({ timeOfDay: 6000, hasCeilingAbove: true, nearbyPlayerDistance: 10 })).toBe(
      true,
    );
  });

  it('night flies', () => {
    expect(isResting({ timeOfDay: 18000, hasCeilingAbove: true, nearbyPlayerDistance: 10 })).toBe(
      false,
    );
  });

  it('nearby player wakes', () => {
    expect(
      isResting({
        timeOfDay: 6000,
        hasCeilingAbove: true,
        nearbyPlayerDistance: WAKE_PLAYER_DISTANCE - 1,
      }),
    ).toBe(false);
  });

  it('flight speed 0 while resting', () => {
    expect(flightSpeed({ timeOfDay: 6000, hasCeilingAbove: true, nearbyPlayerDistance: 20 })).toBe(
      0,
    );
  });
});
