import { describe, it, expect } from 'vitest';
import { isValidSetup, hookPower, breakTripwire, MAX_TRIPWIRE_LENGTH } from './tripwire_hook';

describe('tripwire', () => {
  it('valid setup', () => {
    expect(
      isValidSetup({
        hookAFaces: 'north',
        hookBFaces: 'south',
        distance: 10,
        stringBreakCount: 0,
      }),
    ).toBe(true);
  });

  it('rejects wrong axis', () => {
    expect(
      isValidSetup({
        hookAFaces: 'north',
        hookBFaces: 'east',
        distance: 10,
        stringBreakCount: 0,
      }),
    ).toBe(false);
  });

  it('rejects over-length', () => {
    expect(
      isValidSetup({
        hookAFaces: 'east',
        hookBFaces: 'west',
        distance: MAX_TRIPWIRE_LENGTH + 1,
        stringBreakCount: 0,
      }),
    ).toBe(false);
  });

  it('hook power with entity', () => {
    expect(hookPower({ entityOnTripwire: true, stringIntact: true })).toBe(15);
    expect(hookPower({ entityOnTripwire: false, stringIntact: true })).toBe(0);
    expect(hookPower({ entityOnTripwire: true, stringIntact: false })).toBe(0);
  });

  it('shears vs other break', () => {
    expect(breakTripwire(true)).toBe('drop_string');
    expect(breakTripwire(false)).toBe('drop_string_trigger');
  });
});
