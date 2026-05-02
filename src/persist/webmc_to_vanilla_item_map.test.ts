import { describe, it, expect } from 'vitest';
import { mapWebmcToVanillaItemName } from './webmc_to_vanilla_item_map';

describe('webmc → vanilla item name reverse mapping', () => {
  it('strips webmc: namespace and adds minecraft:', () => {
    expect(mapWebmcToVanillaItemName('webmc:diamond_sword')).toBe('minecraft:diamond_sword');
    expect(mapWebmcToVanillaItemName('diamond_sword')).toBe('minecraft:diamond_sword');
  });

  it('preserves plain names that need no rename', () => {
    expect(mapWebmcToVanillaItemName('webmc:stick')).toBe('minecraft:stick');
    expect(mapWebmcToVanillaItemName('webmc:torch')).toBe('minecraft:torch');
  });
});
