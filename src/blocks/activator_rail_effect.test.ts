import { describe, it, expect } from 'vitest';
import {
  ejectsPassenger,
  primesTnt,
  togglesCommand,
  type ActivatorInput,
} from './activator_rail_effect';

const powered: ActivatorInput = { rails: 1, powered: true, cartType: 'normal', hasPassenger: true };

describe('activator rail effect', () => {
  it('ejects passenger', () => {
    expect(ejectsPassenger(powered)).toBe(true);
  });

  it('no eject unpowered', () => {
    expect(ejectsPassenger({ ...powered, powered: false })).toBe(false);
  });

  it('primes TNT cart', () => {
    expect(primesTnt({ ...powered, cartType: 'tnt' })).toBe(true);
  });

  it('does not prime non-TNT', () => {
    expect(primesTnt(powered)).toBe(false);
  });

  it('command cart toggles', () => {
    expect(togglesCommand({ ...powered, cartType: 'command' }, false)).toBe(true);
  });

  it('unpowered no toggle', () => {
    expect(togglesCommand({ ...powered, cartType: 'command', powered: false }, false)).toBe(false);
  });
});
