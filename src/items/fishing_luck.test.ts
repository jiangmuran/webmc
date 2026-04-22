import { describe, it, expect } from 'vitest';
import {
  computeCategoryWeights,
  pickCategory,
  pickTreasureItem,
  rollWaitSec,
} from './fishing_luck';

describe('fishing luck', () => {
  it('no enchants = base weights', () => {
    const w = computeCategoryWeights({ luckOfTheSea: 0, lure: 0, luckEffect: 0 });
    expect(w.fish).toBe(85);
    expect(w.treasure).toBe(5);
    expect(w.junk).toBe(10);
  });

  it('luck shifts to treasure', () => {
    const w = computeCategoryWeights({ luckOfTheSea: 3, lure: 0, luckEffect: 0 });
    expect(w.treasure).toBeGreaterThan(5);
    expect(w.junk).toBeLessThan(10);
  });

  it('low roll = fish', () => {
    const w = computeCategoryWeights({ luckOfTheSea: 0, lure: 0, luckEffect: 0 });
    expect(pickCategory(w, 0.1)).toBe('fish');
  });

  it('mid roll = treasure (low weight but reachable)', () => {
    const w = computeCategoryWeights({ luckOfTheSea: 0, lure: 0, luckEffect: 0 });
    expect(pickCategory(w, 0.88)).toBe('treasure');
  });

  it('lure reduces wait time', () => {
    const withLure = rollWaitSec({ lure: 3, rng: () => 0 });
    const noLure = rollWaitSec({ lure: 0, rng: () => 0 });
    expect(withLure).toBeLessThan(noLure);
  });

  it('wait sec above 1', () => {
    expect(rollWaitSec({ lure: 3, rng: () => 0 })).toBeGreaterThanOrEqual(1);
  });

  it('treasure pool picks', () => {
    expect(pickTreasureItem(0.01)).toBe('webmc:enchanted_book');
    expect(pickTreasureItem(0.99)).toBe('webmc:lily_pad');
  });
});
