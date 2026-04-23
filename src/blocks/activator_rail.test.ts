import { describe, it, expect } from 'vitest';
import { primesTnt, ejectsRider, togglesHopperPickup, firesCommandBlock } from './activator_rail';

describe('activator rail', () => {
  it('primes tnt cart', () => {
    expect(primesTnt({ powered: true, cart: 'tnt' })).toBe(true);
    expect(primesTnt({ powered: false, cart: 'tnt' })).toBe(false);
  });

  it('ejects rider from minecart', () => {
    expect(ejectsRider({ powered: true, cart: 'minecart' })).toBe(true);
    expect(ejectsRider({ powered: true, cart: 'tnt' })).toBe(false);
  });

  it('toggles hopper pickup', () => {
    expect(togglesHopperPickup({ powered: true, cart: 'hopper' })).toBe(true);
  });

  it('fires command block cart', () => {
    expect(firesCommandBlock({ powered: true, cart: 'command' })).toBe(true);
  });
});
