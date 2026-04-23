import { describe, it, expect } from 'vitest';
import {
  totalXpCost,
  isTooExpensive,
  newPriorWorkPenalty,
  penaltyFromTimes,
  TOO_EXPENSIVE,
} from './anvil_xp_cost_model';

describe('anvil xp cost model', () => {
  it('sum', () => {
    expect(
      totalXpCost({
        baseCost: 1,
        priorWorkLeft: 1,
        priorWorkRight: 3,
        enchantCost: 5,
        renameCost: 0,
      }),
    ).toBe(10);
  });

  it('too expensive gates combines', () => {
    expect(
      isTooExpensive(
        { baseCost: 10, priorWorkLeft: 15, priorWorkRight: 15, enchantCost: 5, renameCost: 0 },
        false,
      ),
    ).toBe(true);
  });

  it('creative never too expensive', () => {
    expect(
      isTooExpensive(
        {
          baseCost: 100,
          priorWorkLeft: 100,
          priorWorkRight: 100,
          enchantCost: 100,
          renameCost: 100,
        },
        true,
      ),
    ).toBe(false);
  });

  it('prior work is max+1', () => {
    expect(newPriorWorkPenalty(2, 5)).toBe(6);
  });

  it('penalty 2^n-1', () => {
    expect(penaltyFromTimes(3)).toBe(7);
  });

  it('TOO_EXPENSIVE constant is 40', () => {
    expect(TOO_EXPENSIVE).toBe(40);
  });
});
