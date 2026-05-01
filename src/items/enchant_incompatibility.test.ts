import { describe, it, expect } from 'vitest';
import { areIncompatible, validCombination } from './enchant_incompatibility';

describe('enchant incompatibility', () => {
  it('sharpness + smite incompatible', () => {
    expect(areIncompatible('sharpness', 'smite')).toBe(true);
  });

  it('sharpness + fire_aspect ok', () => {
    expect(areIncompatible('sharpness', 'fire_aspect')).toBe(false);
  });

  it('fortune + silk touch bad', () => {
    expect(areIncompatible('fortune', 'silk_touch')).toBe(true);
  });

  it('valid combo passes', () => {
    expect(validCombination(['sharpness', 'fire_aspect', 'unbreaking'])).toBe(true);
  });

  it('invalid combo fails', () => {
    expect(validCombination(['sharpness', 'smite'])).toBe(false);
  });

  it('1.21 mace conflicts (wiki: breach + density / damage family / impaling)', () => {
    expect(areIncompatible('breach', 'density')).toBe(true);
    expect(areIncompatible('breach', 'sharpness')).toBe(true);
    expect(areIncompatible('breach', 'smite')).toBe(true);
    expect(areIncompatible('breach', 'bane_of_arthropods')).toBe(true);
    expect(areIncompatible('breach', 'impaling')).toBe(true);
    // Density only conflicts with Breach, not damage family.
    expect(areIncompatible('density', 'sharpness')).toBe(false);
  });
});
