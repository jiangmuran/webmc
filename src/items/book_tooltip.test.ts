import { describe, it, expect } from 'vitest';
import { displayEnchantLine, orderTooltip, romanNumeral } from './book_tooltip';

describe('book tooltip', () => {
  it('romanNumeral conversion', () => {
    expect(romanNumeral(1)).toBe('I');
    expect(romanNumeral(4)).toBe('IV');
    expect(romanNumeral(10)).toBe('X');
    expect(romanNumeral(11)).toBe('11');
  });

  it('level 1 has no numeral', () => {
    expect(displayEnchantLine({ id: 'sharpness', level: 1 })).toBe('Sharpness');
  });

  it('level 4 shows IV', () => {
    expect(displayEnchantLine({ id: 'protection', level: 4 })).toBe('Protection IV');
  });

  it('unknown id passes through', () => {
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
    expect(lines[0]?.line).toBe('Feather Falling');
  });
});
