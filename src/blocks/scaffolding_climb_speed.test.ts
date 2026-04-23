import { describe, it, expect } from 'vitest';
import { isSupported, verticalVelocity, MAX_SUPPORT_DISTANCE } from './scaffolding_climb_speed';

describe('scaffolding climb speed', () => {
  it('close support ok', () => {
    expect(
      isSupported({ distanceFromBase: 3, sneaking: false, pressingUp: false, pressingDown: false }),
    ).toBe(true);
  });

  it('too far fails', () => {
    expect(
      isSupported({
        distanceFromBase: MAX_SUPPORT_DISTANCE + 1,
        sneaking: false,
        pressingUp: false,
        pressingDown: false,
      }),
    ).toBe(false);
  });

  it('up climbs', () => {
    expect(
      verticalVelocity({
        distanceFromBase: 0,
        sneaking: false,
        pressingUp: true,
        pressingDown: false,
      }),
    ).toBeGreaterThan(0);
  });

  it('sneak holds', () => {
    expect(
      verticalVelocity({
        distanceFromBase: 0,
        sneaking: true,
        pressingUp: true,
        pressingDown: false,
      }),
    ).toBe(0);
  });
});
