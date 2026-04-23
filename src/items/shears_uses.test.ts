import { describe, it, expect } from 'vitest';
import { isShearable, woolCountFromSheep, durabilityCost, mooshroomBecomesCow } from './shears_uses';

describe('shears uses', () => {
  it('shearable targets', () => {
    expect(isShearable('sheep')).toBe(true);
    expect(isShearable('leaves')).toBe(true);
  });

  it('wool 1-3', () => {
    const n = woolCountFromSheep(() => 0.5);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(3);
  });

  it('durability cost 1 per use', () => {
    expect(durabilityCost('leaves')).toBe(1);
  });

  it('mooshroom becomes cow', () => {
    expect(mooshroomBecomesCow()).toBe(true);
  });
});
