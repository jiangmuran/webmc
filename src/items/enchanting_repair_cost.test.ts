import { describe, it, expect } from 'vitest';
import {
  grindstoneOutput,
  isTooExpensive,
  nextPriorWork,
  priorWorkPenalty,
  totalAnvilCost,
  TOO_EXPENSIVE_THRESHOLD,
} from './enchanting_repair_cost';

describe('anvil repair cost', () => {
  it('prior work doubles', () => {
    expect(priorWorkPenalty(0)).toBe(0);
    expect(priorWorkPenalty(1)).toBe(1);
    expect(priorWorkPenalty(3)).toBe(7);
    expect(priorWorkPenalty(6)).toBe(63);
  });

  it('total combines left + right + enchant + rename', () => {
    const cost = totalAnvilCost({
      priorWorkLeft: 2,
      priorWorkRight: 1,
      levelsFromEnchants: 5,
      renaming: true,
    });
    // left=3, right=1, enchants=5, rename=1 → 10
    expect(cost).toBe(10);
  });

  it('too expensive threshold', () => {
    expect(isTooExpensive(39)).toBe(false);
    expect(isTooExpensive(TOO_EXPENSIVE_THRESHOLD)).toBe(true);
  });

  it('nextPriorWork increments', () => {
    expect(nextPriorWork(2)).toBe(3);
  });

  it('grindstone clears enchants + priorWork', () => {
    const r = grindstoneOutput(5, ['sharpness', 'unbreaking']);
    expect(r.priorWork).toBe(0);
    expect(r.enchants).toEqual([]);
    expect(r.xpDropped).toBeGreaterThan(0);
  });
});
