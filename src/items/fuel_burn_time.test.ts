import { describe, it, expect } from 'vitest';
import { burnTicksFor, isFuel, itemsSmeltedPerFuelUnit } from './fuel_burn_time';

describe('fuel burn time', () => {
  it('coal 1600', () => {
    expect(burnTicksFor('coal')).toBe(1600);
  });

  it('lava bucket longest', () => {
    expect(burnTicksFor('lava_bucket')).toBeGreaterThan(burnTicksFor('coal_block'));
  });

  it('stone not fuel', () => {
    expect(isFuel('stone')).toBe(false);
  });

  it('coal smelts 8', () => {
    expect(itemsSmeltedPerFuelUnit('coal')).toBe(8);
  });

  it('oak log smelts 1.5 → floor 1', () => {
    expect(itemsSmeltedPerFuelUnit('oak_log')).toBe(1);
  });
});
