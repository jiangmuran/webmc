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
});
