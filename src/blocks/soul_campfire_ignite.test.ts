import { describe, it, expect } from 'vitest';
import { lights, extinguishableByWaterBottle, damageMultiplier } from './soul_campfire_ignite';

describe('soul campfire ignite', () => {
  it('flint works', () => {
    expect(lights({ tool: 'flint_and_steel', isSoulCampfire: true, alreadyLit: false })).toBe(true);
  });

  it('already lit fails', () => {
    expect(lights({ tool: 'flint_and_steel', isSoulCampfire: true, alreadyLit: true })).toBe(false);
  });

  it('diamond does not light', () => {
    expect(lights({ tool: 'diamond', isSoulCampfire: false, alreadyLit: false })).toBe(false);
  });

  it('water bottle extinguish', () => {
    expect(extinguishableByWaterBottle()).toBe(true);
  });

  it('soul damage 2x', () => {
    expect(damageMultiplier(true)).toBeGreaterThan(damageMultiplier(false));
  });
});
