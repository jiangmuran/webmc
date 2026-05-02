import { describe, it, expect } from 'vitest';
import { phaseForDay, slimeSpawnMultiplier, isFullMoon, isNewMoon } from './moon_phase';

describe('moon phase', () => {
  it('day 0 = full', () => {
    expect(isFullMoon(phaseForDay(0))).toBe(true);
  });

  it('day 4 = new', () => {
    expect(isNewMoon(phaseForDay(4))).toBe(true);
  });

  it('cycles every 8', () => {
    expect(phaseForDay(8)).toBe(phaseForDay(0));
    expect(phaseForDay(16)).toBe(phaseForDay(0));
  });

  it('negative days work', () => {
    expect(phaseForDay(-1)).toBeGreaterThanOrEqual(0);
    expect(phaseForDay(-1)).toBeLessThan(8);
  });

  it('slime boost at full', () => {
    expect(slimeSpawnMultiplier(0)).toBe(1);
  });

  it('slime zero at new', () => {
    expect(slimeSpawnMultiplier(4)).toBe(0);
  });

  it('slime spawn brightness curve matches wiki 8 phases', () => {
    // Phases 0-7 = full, waning gibbous, last quarter, waning crescent,
    // new, waxing crescent, first quarter, waxing gibbous.
    expect(slimeSpawnMultiplier(0)).toBe(1.0);
    expect(slimeSpawnMultiplier(1)).toBe(0.75);
    expect(slimeSpawnMultiplier(2)).toBe(0.5);
    expect(slimeSpawnMultiplier(3)).toBe(0.25);
    expect(slimeSpawnMultiplier(4)).toBe(0.0);
    expect(slimeSpawnMultiplier(5)).toBe(0.25);
    expect(slimeSpawnMultiplier(6)).toBe(0.5);
    expect(slimeSpawnMultiplier(7)).toBe(0.75);
  });
});
