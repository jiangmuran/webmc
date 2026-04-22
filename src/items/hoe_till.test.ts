import { describe, it, expect } from 'vitest';
import { useHoe } from './hoe_till';

describe('hoe till', () => {
  it('dirt + air above → farmland', () => {
    expect(useHoe({ targetBlockName: 'webmc:dirt', airAbove: true }).tilled).toBe('farmland');
  });

  it('path reverts to dirt', () => {
    expect(useHoe({ targetBlockName: 'webmc:dirt_path', airAbove: true }).tilled).toBe('dirt');
  });

  it('solid block above prevents tilling', () => {
    expect(useHoe({ targetBlockName: 'webmc:dirt', airAbove: false }).tilled).toBeNull();
  });

  it("stone can't be tilled", () => {
    expect(useHoe({ targetBlockName: 'webmc:stone', airAbove: true }).tilled).toBeNull();
  });

  it('tilling costs 1 durability', () => {
    expect(useHoe({ targetBlockName: 'webmc:dirt', airAbove: true }).durabilityCost).toBe(1);
  });
});
