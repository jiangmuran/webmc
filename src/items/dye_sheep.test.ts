import { describe, it, expect } from 'vitest';
import { dyeSheep, shear, breedColor, eatGrassRegrow } from './dye_sheep';

describe('sheep dye', () => {
  it('dye changes color', () => {
    const s = { color: 'white' as const, sheared: false };
    expect(dyeSheep(s, 'red')).toBe(true);
    expect(s.color).toBe('red');
  });

  it('dye same = no-op', () => {
    const s = { color: 'red' as const, sheared: false };
    expect(dyeSheep(s, 'red')).toBe(false);
  });

  it('shear only once until regrow', () => {
    const s = { color: 'red' as const, sheared: false };
    expect(shear(s)?.color).toBe('red');
    expect(shear(s)).toBeNull();
    expect(eatGrassRegrow(s)).toBe(true);
    expect(shear(s)).not.toBeNull();
  });

  it('breed color: same', () => {
    expect(breedColor('red', 'red')).toBe('red');
  });

  it('breed color: mix', () => {
    expect(breedColor('red', 'yellow')).toBe('orange');
    expect(breedColor('blue', 'green')).toBe('cyan');
  });

  it('breed color: no match = white', () => {
    expect(breedColor('red', 'purple')).toBe('white');
  });
});
