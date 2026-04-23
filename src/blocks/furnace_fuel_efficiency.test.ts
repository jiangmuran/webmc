import { describe, it, expect } from 'vitest';
import { simulateBurn, fuelWasteWhenNoItems } from './furnace_fuel_efficiency';

describe('furnace fuel efficiency', () => {
  it('smelts up to fuel', () => {
    const r = simulateBurn({ fuelBurnTicks: 1000, itemsAvailable: 20, outputFree: 64 });
    expect(r.itemsSmelted).toBe(5);
    expect(r.fuelLeft).toBe(0);
  });

  it('limited by items', () => {
    const r = simulateBurn({ fuelBurnTicks: 10000, itemsAvailable: 3, outputFree: 64 });
    expect(r.itemsSmelted).toBe(3);
  });

  it('limited by output', () => {
    const r = simulateBurn({ fuelBurnTicks: 10000, itemsAvailable: 50, outputFree: 2 });
    expect(r.itemsSmelted).toBe(2);
  });

  it('waste when no items', () => {
    expect(fuelWasteWhenNoItems(1000, 0)).toBe(1000);
    expect(fuelWasteWhenNoItems(1000, 5)).toBe(0);
  });
});
