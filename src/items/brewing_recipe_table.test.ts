import { describe, it, expect } from 'vitest';
import { brewResult, canExtendWithRedstone, canAmplifyWithGlowstone } from './brewing_recipe_table';

describe('brewing recipe table', () => {
  it('water + nether wart → awkward', () => {
    expect(brewResult('water', 'nether_wart')).toBe('awkward');
  });

  it('awkward + blaze powder → strength', () => {
    expect(brewResult('awkward', 'blaze_powder')).toBe('strength');
  });

  it('healing + spider eye → harming', () => {
    expect(brewResult('healing', 'fermented_spider_eye')).toBe('harming');
  });

  it('unknown combo (no recipe)', () => {
    expect(brewResult('water', 'oak_log')).toBeUndefined();
  });

  it('water + sugar → mundane (wiki Mundane_Potion)', () => {
    expect(brewResult('water', 'sugar')).toBe('mundane');
  });

  it('water + stone → mundane (wiki Mundane_Potion)', () => {
    expect(brewResult('water', 'stone')).toBe('mundane');
  });

  it('water + magma_cream → mundane (NOT fire_resistance — that needs awkward base)', () => {
    expect(brewResult('water', 'magma_cream')).toBe('mundane');
    expect(brewResult('awkward', 'magma_cream')).toBe('fire_resistance');
  });

  it('healing not extendable', () => {
    expect(canExtendWithRedstone('healing')).toBe(false);
  });

  it('strength can be extended', () => {
    expect(canExtendWithRedstone('strength')).toBe(true);
  });

  it('awkward not amplifiable', () => {
    expect(canAmplifyWithGlowstone('awkward')).toBe(false);
  });
});
