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

  it('breed color: full wiki mix table', () => {
    // Wiki (minecraft.wiki/w/Sheep#Breeding) sheep-breed mix table.
    expect(breedColor('white', 'gray')).toBe('light_gray');
    expect(breedColor('white', 'green')).toBe('lime');
    expect(breedColor('white', 'blue')).toBe('light_blue');
    expect(breedColor('pink', 'purple')).toBe('magenta');
    expect(breedColor('white', 'black')).toBe('gray');
    expect(breedColor('white', 'red')).toBe('pink');
    // Mix table is order-independent.
    expect(breedColor('green', 'white')).toBe('lime');
  });

  it('breed color: no mix → random parent (wiki, not white)', () => {
    // Wiki: "If the dye colors cannot normally be mixed, the baby
    // sheep spawns with the same color as one of the parents, chosen
    // randomly." Old code fell back to 'white' — non-vanilla.
    expect(breedColor('red', 'purple', () => 0.0)).toBe('red');
    expect(breedColor('red', 'purple', () => 0.99)).toBe('purple');
  });
});
