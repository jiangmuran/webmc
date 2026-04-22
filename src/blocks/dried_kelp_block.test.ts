import { describe, it, expect } from 'vitest';
import {
  smeltCount,
  canCraftBlock,
  unblockCount,
  DRIED_KELP_BLOCK_SMELT_COUNT,
  BLOCK_CRAFT_COST,
} from './dried_kelp_block';

describe('dried kelp block', () => {
  it('smelts 20', () => {
    expect(smeltCount()).toBe(20);
    expect(DRIED_KELP_BLOCK_SMELT_COUNT).toBe(20);
  });

  it('craft needs 9', () => {
    expect(canCraftBlock({ driedKelpCount: 9 })).toBe(true);
    expect(canCraftBlock({ driedKelpCount: 8 })).toBe(false);
    expect(BLOCK_CRAFT_COST).toBe(9);
  });

  it('unblock yields 9', () => {
    expect(unblockCount()).toBe(9);
  });
});
