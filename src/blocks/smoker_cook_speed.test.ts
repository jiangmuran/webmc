import { describe, it, expect } from 'vitest';
import {
  smeltTicksFor,
  canSmeltIn,
  FAST_SMELT_TICKS,
  NORMAL_SMELT_TICKS,
} from './smoker_cook_speed';

describe('smoker/blast', () => {
  it('smoker 2x faster', () => {
    expect(smeltTicksFor({ kind: 'smoker', inputId: 'webmc:beef' })).toBe(FAST_SMELT_TICKS);
    expect(smeltTicksFor({ kind: 'furnace', inputId: 'webmc:beef' })).toBe(NORMAL_SMELT_TICKS);
  });

  it('smoker food only', () => {
    expect(canSmeltIn({ kind: 'smoker', inputId: 'webmc:iron_ore' })).toBe(false);
    expect(canSmeltIn({ kind: 'smoker', inputId: 'webmc:beef' })).toBe(true);
  });

  it('blast furnace metals only', () => {
    expect(canSmeltIn({ kind: 'blast_furnace', inputId: 'webmc:iron_ore' })).toBe(true);
    expect(canSmeltIn({ kind: 'blast_furnace', inputId: 'webmc:beef' })).toBe(false);
  });

  it('normal furnace universal', () => {
    expect(canSmeltIn({ kind: 'furnace', inputId: 'webmc:beef' })).toBe(true);
  });
});
