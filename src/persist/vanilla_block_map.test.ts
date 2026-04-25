import { describe, it, expect } from 'vitest';
import { mapVanillaName, resolveVanillaName } from './vanilla_block_map';
import { createDefaultRegistry } from '../blocks/registry';

describe('vanilla → webmc block name mapping', () => {
  it('strips minecraft: namespace and adds webmc:', () => {
    expect(mapVanillaName('minecraft:stone')).toBe('webmc:stone');
    expect(mapVanillaName('stone')).toBe('webmc:stone');
  });

  it('renames vanilla wool variants to webmc wool_<color>', () => {
    expect(mapVanillaName('minecraft:red_wool')).toBe('webmc:wool_red');
    expect(mapVanillaName('blue_wool')).toBe('webmc:wool_blue');
    expect(mapVanillaName('light_gray_wool')).toBe('webmc:wool_light_gray');
  });

  it('renames pre-1.20 grass to grass_block', () => {
    expect(mapVanillaName('minecraft:grass')).toBe('webmc:grass_block');
  });

  it('resolveVanillaName uses registry lookup with fallback', () => {
    const r = createDefaultRegistry();
    const stoneId = r.byName('webmc:stone');
    expect(stoneId).toBeDefined();
    if (stoneId === undefined) return;

    expect(resolveVanillaName('minecraft:stone', (n) => r.byName(n), stoneId)).toBe(stoneId);
    expect(resolveVanillaName('minecraft:red_wool', (n) => r.byName(n), stoneId)).toBe(
      r.byName('webmc:wool_red'),
    );
    // Unknown name → fallback.
    expect(resolveVanillaName('minecraft:imaginary_block', (n) => r.byName(n), stoneId)).toBe(
      stoneId,
    );
  });
});
