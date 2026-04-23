import { describe, it, expect } from 'vitest';
import {
  toIngot,
  toBlock,
  toNuggets,
  toIngotsFromBlocks,
  isIntegerCycle,
} from './nugget_ingot_block';

describe('nugget ingot block', () => {
  it('9 nuggets = 1 ingot', () => {
    expect(toIngot(9)).toEqual({ ingots: 1, remainder: 0 });
  });

  it('10 nuggets 1+1', () => {
    expect(toIngot(10)).toEqual({ ingots: 1, remainder: 1 });
  });

  it('9 ingots = 1 block', () => {
    expect(toBlock(9)).toEqual({ blocks: 1, remainder: 0 });
  });

  it('reverse nuggets', () => {
    expect(toNuggets(5)).toBe(45);
  });

  it('reverse blocks', () => {
    expect(toIngotsFromBlocks(3)).toBe(27);
  });

  it('integer cycle', () => {
    expect(isIntegerCycle()).toBe(true);
  });
});
