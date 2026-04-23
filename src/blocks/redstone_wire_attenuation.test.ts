import { describe, it, expect } from 'vitest';
import { propagateFrom, maxDistance, strongerOf, MAX_SIGNAL } from './redstone_wire_attenuation';

describe('redstone wire attenuation', () => {
  it('loses 1 per block', () => {
    expect(propagateFrom(15, 5)).toBe(10);
  });

  it('zero past range', () => {
    expect(propagateFrom(5, 10)).toBe(0);
  });

  it('max range 15', () => {
    expect(maxDistance()).toBe(MAX_SIGNAL);
  });

  it('stronger wins', () => {
    expect(strongerOf(7, 11)).toBe(11);
  });
});
