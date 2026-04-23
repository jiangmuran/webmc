import { describe, it, expect } from 'vitest';
import {
  repairMaterialCost,
  renameCost,
  combineCost,
  isTooExpensive,
  nextPriorWorkPenalty,
  MAX_USABLE_COST,
  type Item,
} from './anvil_repair_cost';

const item: Item = {
  id: 'diamond_sword',
  maxDurability: 1561,
  damage: 400,
  priorWorkPenalty: 0,
  enchants: [],
};

describe('anvil repair cost', () => {
  it('undamaged repair cheap', () => {
    expect(repairMaterialCost({ ...item, damage: 0 }, 1)).toBeGreaterThan(0);
  });

  it('rename costs 1', () => {
    expect(renameCost(true)).toBe(1);
  });

  it('no rename free', () => {
    expect(renameCost(false)).toBe(0);
  });

  it('combine adds enchant cost', () => {
    const b: Item = { ...item, enchants: [{ id: 'sharpness', level: 3 }] };
    expect(combineCost(item, b, false)).toBeGreaterThan(combineCost(item, item, false));
  });

  it('too expensive over 40', () => {
    expect(isTooExpensive(MAX_USABLE_COST, false)).toBe(true);
  });

  it('creative ignores cap', () => {
    expect(isTooExpensive(MAX_USABLE_COST, true)).toBe(false);
  });

  it('prior work penalty doubles', () => {
    expect(nextPriorWorkPenalty(0)).toBe(1);
    expect(nextPriorWorkPenalty(3)).toBe(7);
  });
});
