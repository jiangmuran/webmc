import { describe, it, expect } from 'vitest';
import { mapWebmcToVanillaName } from './webmc_to_vanilla_block_map';
import { mapVanillaName } from './vanilla_block_map';

describe('webmc → vanilla block name reverse mapping', () => {
  it('strips webmc: namespace and adds minecraft:', () => {
    expect(mapWebmcToVanillaName('webmc:stone')).toBe('minecraft:stone');
    expect(mapWebmcToVanillaName('stone')).toBe('minecraft:stone');
  });

  it('renames webmc wool_<color> back to vanilla <color>_wool', () => {
    expect(mapWebmcToVanillaName('webmc:wool_red')).toBe('minecraft:red_wool');
    expect(mapWebmcToVanillaName('webmc:wool_light_gray')).toBe('minecraft:light_gray_wool');
    expect(mapWebmcToVanillaName('webmc:wool_white')).toBe('minecraft:white_wool');
  });

  it('round-trips through the forward mapper', () => {
    const samples = [
      'minecraft:stone',
      'minecraft:diamond_block',
      'minecraft:red_wool',
      'minecraft:light_gray_wool',
      'minecraft:oak_log',
    ];
    for (const s of samples) {
      const fwd = mapVanillaName(s);
      const back = mapWebmcToVanillaName(fwd);
      expect(back, `round-trip ${s}`).toBe(s);
    }
  });
});
