import { describe, it, expect } from 'vitest';
import { craftConcretePowder, onFallLand, solidify } from './concrete_powder';

describe('concrete powder', () => {
  it('water solidifies', () => {
    expect(solidify({ color: 'red', touchingWater: true }).newBlock).toBe('webmc:red_concrete');
  });

  it('dry = no change', () => {
    expect(solidify({ color: 'red', touchingWater: false }).solidified).toBe(false);
  });

  it('fall on water = solid concrete', () => {
    expect(onFallLand({ color: 'blue', fallDistanceBlocks: 5, landedOnWater: true })).toBe(
      'webmc:blue_concrete',
    );
  });

  it('fall on dry = stays powder', () => {
    expect(onFallLand({ color: 'blue', fallDistanceBlocks: 5, landedOnWater: false })).toBe(
      'webmc:blue_concrete_powder',
    );
  });

  it('craft needs sand+gravel+dye', () => {
    expect(craftConcretePowder({ sand: 4, gravel: 4, dye: 'cyan' })?.count).toBe(8);
    expect(craftConcretePowder({ sand: 3, gravel: 4, dye: 'cyan' })).toBeNull();
    expect(craftConcretePowder({ sand: 4, gravel: 4, dye: null })).toBeNull();
  });
});
