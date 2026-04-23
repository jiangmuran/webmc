import { describe, it, expect } from 'vitest';
import { addCoal, tick, isActive, FUEL_PER_COAL } from './furnace_minecart';

describe('furnace minecart', () => {
  it('coal adds fuel', () => {
    const c = addCoal({ fuelTicks: 0, pushX: 0, pushZ: 0 });
    expect(c.fuelTicks).toBe(FUEL_PER_COAL);
  });

  it('tick burns fuel', () => {
    const c = tick({ fuelTicks: 10, pushX: 0, pushZ: 0 });
    expect(c.fuelTicks).toBe(9);
  });

  it('tick at 0 stays 0', () => {
    expect(tick({ fuelTicks: 0, pushX: 0, pushZ: 0 }).fuelTicks).toBe(0);
  });

  it('active while fueled', () => {
    expect(isActive({ fuelTicks: 10, pushX: 0, pushZ: 0 })).toBe(true);
    expect(isActive({ fuelTicks: 0, pushX: 0, pushZ: 0 })).toBe(false);
  });
});
