import { describe, it, expect } from 'vitest';
import {
  isShivering,
  movementMultiplier,
  looksDifferentWhenShivering,
  SHIVER_THRESHOLD,
} from './strider_cold_shiver';

describe('strider cold shiver', () => {
  it('lava walker warm', () => {
    expect(isShivering({ inLava: true, shiveringTicks: 0, ticksSinceLastLava: 0 })).toBe(false);
  });

  it('cold long enough shivers', () => {
    expect(
      isShivering({ inLava: false, shiveringTicks: 0, ticksSinceLastLava: SHIVER_THRESHOLD }),
    ).toBe(true);
  });

  it('shivering slower', () => {
    expect(
      movementMultiplier({
        inLava: false,
        shiveringTicks: 0,
        ticksSinceLastLava: SHIVER_THRESHOLD,
      }),
    ).toBeLessThan(movementMultiplier({ inLava: false, shiveringTicks: 0, ticksSinceLastLava: 0 }));
  });

  it('visual hint', () => {
    expect(looksDifferentWhenShivering()).toBe(true);
  });
});
