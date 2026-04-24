import { describe, it, expect } from 'vitest';
import {
  smeltTicksFor,
  canSmelt,
  FURNACE_SMELT_TICKS,
  BLAST_FURNACE_SMELT_TICKS,
  SMOKER_SMELT_TICKS,
} from './smoker_blast_furnace_speed';

describe('smoker/blast furnace speed', () => {
  it('blast furnace halves default', () => {
    expect(BLAST_FURNACE_SMELT_TICKS).toBe(FURNACE_SMELT_TICKS / 2);
  });

  it('smoker halves default', () => {
    expect(SMOKER_SMELT_TICKS).toBe(FURNACE_SMELT_TICKS / 2);
  });

  it('ticks lookup', () => {
    expect(smeltTicksFor('furnace')).toBe(FURNACE_SMELT_TICKS);
    expect(smeltTicksFor('smoker')).toBe(SMOKER_SMELT_TICKS);
  });

  it('blast furnace only smelts ores', () => {
    expect(canSmelt('blast_furnace', 'iron_ore')).toBe(true);
    expect(canSmelt('blast_furnace', 'beef')).toBe(false);
  });

  it('smoker only smelts food', () => {
    expect(canSmelt('smoker', 'beef')).toBe(true);
    expect(canSmelt('smoker', 'iron_ore')).toBe(false);
  });

  it('regular furnace smelts anything', () => {
    expect(canSmelt('furnace', 'any_item')).toBe(true);
  });
});
