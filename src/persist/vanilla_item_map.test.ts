import { describe, it, expect } from 'vitest';
import { mapVanillaItemName, resolveVanillaItem } from './vanilla_item_map';

describe('vanilla → webmc item name mapping', () => {
  it('strips minecraft: namespace and adds webmc:', () => {
    expect(mapVanillaItemName('minecraft:diamond_sword')).toBe('webmc:diamond_sword');
    expect(mapVanillaItemName('diamond_sword')).toBe('webmc:diamond_sword');
  });

  it('renames grass to grass_block', () => {
    expect(mapVanillaItemName('minecraft:grass')).toBe('webmc:grass_block');
  });

  it('resolveVanillaItem hits registry lookup', () => {
    const fakeRegistry: Record<string, number> = {
      'webmc:diamond_sword': 7,
      'webmc:grass_block': 9,
    };
    const lookup = (n: string): number | undefined => fakeRegistry[n];
    expect(resolveVanillaItem('minecraft:diamond_sword', lookup)).toBe(7);
    expect(resolveVanillaItem('minecraft:grass', lookup)).toBe(9);
    expect(resolveVanillaItem('minecraft:imaginary', lookup)).toBeUndefined();
  });
});
