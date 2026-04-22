import { describe, it, expect } from 'vitest';
import { brew, makeStand, addFuel, startBrew, BREW_TICKS, FUEL_USES } from './brewing_stand_recipe';

describe('brewing', () => {
  it('water + nether wart = awkward', () => {
    expect(brew('water', 'webmc:nether_wart')).toBe('awkward');
  });

  it('awkward + sugar = speed', () => {
    expect(brew('awkward', 'webmc:sugar')).toBe('speed');
  });

  it('unknown returns null', () => {
    expect(brew('water', 'webmc:stone')).toBeNull();
  });

  it('corrupt with spider eye', () => {
    expect(brew('healing', 'webmc:spider_eye')).toBe('harming');
  });

  it('stand requires fuel', () => {
    const s = makeStand();
    expect(startBrew(s, { input: 'awkward', ingredient: 'webmc:sugar' })).toBe('no_fuel');
    addFuel(s);
    expect(startBrew(s, { input: 'awkward', ingredient: 'webmc:sugar' })).toBe('started');
    expect(s.remainingBrewTicks).toBe(BREW_TICKS);
  });

  it('fuel limited', () => {
    const s = makeStand();
    addFuel(s);
    expect(s.fuelUsesRemaining).toBe(FUEL_USES);
    expect(addFuel(s)).toBe(false);
  });

  it('invalid recipe rejected', () => {
    const s = makeStand();
    addFuel(s);
    expect(startBrew(s, { input: 'water', ingredient: 'webmc:sugar' })).toBe('invalid');
  });
});
