import { describe, it, expect } from 'vitest';
import { renameCost, combineCost, isTooExpensive, MAX_COST } from './anvil_ui';

describe('anvil ui', () => {
  it('same name free', () => {
    expect(renameCost('hi', 'hi')).toBe(0);
  });

  it('new name 1 level', () => {
    expect(renameCost('hi', 'bye')).toBe(1);
  });

  it('combine adds enchant levels + prior work', () => {
    const c = combineCost(
      { enchantLevels: 3, repairCost: 1 },
      { enchantLevels: 2, repairCost: 0 },
      false,
    );
    expect(c).toBe(3 + 2 + 2);
  });

  it('too expensive at 40', () => {
    expect(isTooExpensive(MAX_COST)).toBe(true);
    expect(isTooExpensive(5)).toBe(false);
  });
});
