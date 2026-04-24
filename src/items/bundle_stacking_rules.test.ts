import { describe, it, expect } from 'vitest';
import {
  weightOf,
  totalWeight,
  canAdd,
  fillRatio,
  MAX_BUNDLE_WEIGHT,
  type BundleItem,
} from './bundle_stacking_rules';

describe('bundle stacking rules', () => {
  it('stackable item has small weight', () => {
    expect(weightOf({ id: 'stone', count: 1, maxStack: 64 })).toBe(1);
  });

  it('tools heavy', () => {
    expect(weightOf({ id: 'sword', count: 1, maxStack: 1 })).toBe(64);
  });

  it('can add under cap', () => {
    expect(canAdd([], { id: 'stone', count: 10, maxStack: 64 })).toBe(true);
  });

  it('full bundle rejects', () => {
    const full: BundleItem[] = [{ id: 'stone', count: 64, maxStack: 64 }];
    expect(canAdd(full, { id: 'stone', count: 1, maxStack: 64 })).toBe(false);
  });

  it('total weight accumulates', () => {
    expect(
      totalWeight([
        { id: 'stone', count: 8, maxStack: 64 },
        { id: 'iron', count: 4, maxStack: 64 },
      ]),
    ).toBe(12);
  });

  it('fill ratio bounded', () => {
    expect(fillRatio([{ id: 'stone', count: 999, maxStack: 64 }])).toBe(1);
  });

  it('ratio empty 0', () => {
    expect(fillRatio([])).toBe(0);
  });

  it('max weight 64', () => {
    expect(MAX_BUNDLE_WEIGHT).toBe(64);
  });
});
