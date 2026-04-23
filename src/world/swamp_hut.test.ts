import { describe, it, expect } from 'vitest';
import {
  canGenerate,
  hutDimensions,
  cauldronCount,
  craftingTableCount,
  SWAMP_HUT_WITCH_COUNT,
  SWAMP_HUT_CAT_VARIANT,
} from './swamp_hut';

describe('swamp hut', () => {
  it('generates in swamp by water', () => {
    expect(canGenerate({ biome: 'swamp', nearWaterEdge: true })).toBe(true);
  });

  it('rejects plains', () => {
    expect(canGenerate({ biome: 'plains', nearWaterEdge: true })).toBe(false);
  });

  it('needs water edge', () => {
    expect(canGenerate({ biome: 'swamp', nearWaterEdge: false })).toBe(false);
  });

  it('dims 7x7x9', () => {
    expect(hutDimensions()).toEqual({ w: 7, h: 7, d: 9 });
  });

  it('one witch + black cat', () => {
    expect(SWAMP_HUT_WITCH_COUNT).toBe(1);
    expect(SWAMP_HUT_CAT_VARIANT).toBe('black');
  });

  it('fixtures', () => {
    expect(cauldronCount()).toBe(1);
    expect(craftingTableCount()).toBe(1);
  });
});
