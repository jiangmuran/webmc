import { describe, it, expect } from 'vitest';
import { shouldReturn, returnSpeed, RETURN_DELAY_TICKS } from './trident_loyalty_return';

describe('trident loyalty return', () => {
  it('returns after delay', () => {
    expect(
      shouldReturn({
        loyaltyLevel: 1,
        ticksSinceLaunch: RETURN_DELAY_TICKS,
        ownerAlive: true,
        inVoid: false,
      }),
    ).toBe(true);
  });

  it('no loyalty no return', () => {
    expect(
      shouldReturn({
        loyaltyLevel: 0,
        ticksSinceLaunch: 100,
        ownerAlive: true,
        inVoid: false,
      }),
    ).toBe(false);
  });

  it('void loses trident', () => {
    expect(
      shouldReturn({
        loyaltyLevel: 3,
        ticksSinceLaunch: 100,
        ownerAlive: true,
        inVoid: true,
      }),
    ).toBe(false);
  });

  it('owner dead no return', () => {
    expect(
      shouldReturn({
        loyaltyLevel: 3,
        ticksSinceLaunch: 100,
        ownerAlive: false,
        inVoid: false,
      }),
    ).toBe(false);
  });

  it('speed grows', () => {
    expect(returnSpeed(3)).toBeGreaterThan(returnSpeed(1));
  });
});
