import { describe, it, expect } from 'vitest';
import { isFlammable, tickFire, tryIgniteNeighbor, FIRE_AGE_MAX } from './fire_age_spread';

describe('fire', () => {
  it('flammable list', () => {
    expect(isFlammable('webmc:oak_log')).toBe(true);
    expect(isFlammable('webmc:stone')).toBe(false);
  });

  it('rain burns out', () => {
    expect(tickFire({ age: 0, rand: () => 0, isRaining: true, humidityIsHigh: false })).toBe(
      'burn_out',
    );
  });

  it('old fire burns out', () => {
    expect(
      tickFire({ age: FIRE_AGE_MAX, rand: () => 0, isRaining: false, humidityIsHigh: false }),
    ).toBe('burn_out');
  });

  it('normal ages up', () => {
    expect(tickFire({ age: 0, rand: () => 0.99, isRaining: false, humidityIsHigh: false })).toBe(
      'age_up',
    );
  });

  it('non-flammable neighbor rejected', () => {
    expect(tryIgniteNeighbor({ targetBlockId: 'webmc:stone', fireAge: 5, rand: () => 0 })).toBe(
      false,
    );
  });

  it('flammable neighbor ignites', () => {
    expect(tryIgniteNeighbor({ targetBlockId: 'webmc:oak_log', fireAge: 5, rand: () => 0 })).toBe(
      true,
    );
  });
});
