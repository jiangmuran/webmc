import { describe, it, expect } from 'vitest';
import { flammabilityOf, isFlammable, burnoutChance } from './flammability_table';

describe('flammability table', () => {
  it('oak planks flammable', () => {
    expect(flammabilityOf('oak_planks').flammability).toBe(20);
  });

  it('stone not flammable', () => {
    expect(isFlammable('stone')).toBe(false);
  });

  it('unknown default not flammable', () => {
    expect(isFlammable('magic')).toBe(false);
  });

  it('burnout chance 0-1', () => {
    expect(burnoutChance('tnt')).toBeCloseTo(1);
    expect(burnoutChance('oak_log')).toBeLessThan(1);
  });

  it('wool flammable', () => {
    expect(isFlammable('wool')).toBe(true);
  });
});
