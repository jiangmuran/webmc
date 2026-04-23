import { describe, it, expect } from 'vitest';
import {
  burnTicks,
  itemsSmeltable,
  DEFAULT_SMELT_TICKS,
  BLAST_FURNACE_SMELT_TICKS,
} from './furnace_smelt_time';

describe('furnace smelt time', () => {
  it('coal burns 1600', () => {
    expect(burnTicks('coal')).toBe(1600);
  });

  it('unknown fuel 0', () => {
    expect(burnTicks('diamond')).toBe(0);
  });

  it('coal smelts 8 items', () => {
    expect(itemsSmeltable('coal')).toBe(8);
  });

  it('lava bucket smelts 100', () => {
    expect(itemsSmeltable('lava_bucket')).toBe(100);
  });

  it('blast furnace is faster', () => {
    expect(BLAST_FURNACE_SMELT_TICKS).toBeLessThan(DEFAULT_SMELT_TICKS);
  });

  it('coal in blast furnace yields 16', () => {
    expect(itemsSmeltable('coal', BLAST_FURNACE_SMELT_TICKS)).toBe(16);
  });

  it('stick low burn', () => {
    expect(burnTicks('stick')).toBe(100);
  });
});
