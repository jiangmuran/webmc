import { describe, it, expect } from 'vitest';
import { canBrew, consumeOneBrew, BREWS_PER_POWDER } from './brewing_stand_fuel_blaze';

describe('brewing stand fuel', () => {
  it('empty no brew', () => {
    expect(canBrew({ blazePowderRemaining: 0, brewsPerPowder: 0 })).toBe(false);
  });

  it('with powder brews', () => {
    expect(canBrew({ blazePowderRemaining: 1, brewsPerPowder: 0 })).toBe(true);
  });

  it('consume uses remaining first', () => {
    const r = consumeOneBrew({ blazePowderRemaining: 1, brewsPerPowder: 5 });
    expect(r.blazePowderRemaining).toBe(1);
    expect(r.brewsPerPowder).toBe(4);
  });

  it('consume burns powder when out', () => {
    const r = consumeOneBrew({ blazePowderRemaining: 1, brewsPerPowder: 0 });
    expect(r.blazePowderRemaining).toBe(0);
    expect(r.brewsPerPowder).toBe(BREWS_PER_POWDER - 1);
  });
});
