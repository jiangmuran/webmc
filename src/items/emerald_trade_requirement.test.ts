import { describe, it, expect } from 'vitest';
import { canTrade, cheapestTrade } from './emerald_trade_requirement';

describe('emerald trade requirement', () => {
  it('enough emeralds', () => {
    expect(canTrade({ emeraldCost: 3 }, 5, 0)).toBe(true);
  });

  it('missing emeralds', () => {
    expect(canTrade({ emeraldCost: 10 }, 3, 0)).toBe(false);
  });

  it('item requirement', () => {
    expect(canTrade({ emeraldCost: 2, itemNeeded: { id: 'wheat', count: 5 } }, 5, 3)).toBe(false);
  });

  it('cheapest picked', () => {
    expect(cheapestTrade([{ emeraldCost: 5 }, { emeraldCost: 2 }])).toEqual({
      emeraldCost: 2,
    });
  });
});
