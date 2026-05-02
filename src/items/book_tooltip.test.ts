import { describe, it, expect } from 'vitest';
import { displayEnchantLine, orderTooltip, romanNumeral } from './book_tooltip';

describe('book tooltip', () => {
  it('romanNumeral conversion', () => {
    expect(romanNumeral(1)).toBe('I');
    expect(romanNumeral(4)).toBe('IV');
    expect(romanNumeral(10)).toBe('X');
    expect(romanNumeral(11)).toBe('11');
  });

  it('multi-level enchant at level 1 shows I (wiki)', () => {
    // Wiki: tooltip shows Roman numeral whenever max level > 1.
    // Sharpness max level is 5, so Sharpness I displays as
    // "Sharpness I", not "Sharpness".
    expect(displayEnchantLine({ id: 'sharpness', level: 1 })).toBe('Sharpness I');
  });

  it('single-level enchant has no numeral (wiki)', () => {
    // Mending max=1, Aqua Affinity max=1, Silk Touch max=1.
    expect(displayEnchantLine({ id: 'mending', level: 1 })).toBe('Mending');
    expect(displayEnchantLine({ id: 'silk_touch', level: 1 })).toBe('Silk Touch');
    expect(displayEnchantLine({ id: 'aqua_affinity', level: 1 })).toBe('Aqua Affinity');
  });

  it('level 4 shows IV', () => {
    expect(displayEnchantLine({ id: 'protection', level: 4 })).toBe('Protection IV');
  });

  it('unknown id passes through (no max in table → max=1, no numeral)', () => {
    expect(displayEnchantLine({ id: 'xyz', level: 1 })).toBe('xyz');
  });

  it('curses sorted to bottom', () => {
    const lines = orderTooltip([
      { id: 'curse_of_binding', level: 1 },
      { id: 'sharpness', level: 2 },
    ]);
    expect(lines[0]?.isCurse).toBe(false);
    expect(lines[lines.length - 1]?.isCurse).toBe(true);
  });

  it('alphabetical within group', () => {
    const lines = orderTooltip([
      { id: 'protection', level: 1 },
      { id: 'feather_falling', level: 1 },
    ]);
    // With wiki-correct numerals: "Feather Falling I" < "Protection I".
    expect(lines[0]?.line).toBe('Feather Falling I');
  });
});
