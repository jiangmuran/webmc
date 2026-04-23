import { describe, it, expect } from 'vitest';
import { isBreedItem, canTrust, trustChance } from './ocelot_breed_fish';

describe('ocelot breed fish', () => {
  it('cod is breed item', () => {
    expect(isBreedItem('cod')).toBe(true);
  });

  it('stick not', () => {
    expect(isBreedItem('stick')).toBe(false);
  });

  it('can trust while early', () => {
    expect(canTrust('cod', 2)).toBe(true);
  });

  it('fully trusted stops', () => {
    expect(canTrust('cod', 10)).toBe(false);
  });

  it('trust chance range', () => {
    expect(trustChance()).toBeCloseTo(0.333, 2);
  });
});
