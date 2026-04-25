import { describe, it, expect } from 'vitest';
import {
  detectVanillaFileKind,
  parseLevelDat,
  parsePackMcmeta,
  parseVanillaRecipe,
  parseVanillaTag,
  parseVanillaLootTable,
  encodeNbt,
  decodeNbt,
  mapVanillaName,
  mapVanillaItemName,
} from './vanilla_import';

describe('vanilla_import barrel', () => {
  it('detectVanillaFileKind routes filenames to the right parser', () => {
    expect(detectVanillaFileKind('level.dat')).toBe('level_dat');
    expect(detectVanillaFileKind('saves/world/level.dat')).toBe('level_dat');
    expect(detectVanillaFileKind('r.0.0.mca')).toBe('mca_region');
    expect(detectVanillaFileKind('temple.nbt')).toBe('structure_nbt');
    expect(detectVanillaFileKind('pack.mcmeta')).toBe('pack_mcmeta');
    expect(detectVanillaFileKind('data/minecraft/recipes/torch.json')).toBe('recipe_json');
    expect(detectVanillaFileKind('data/minecraft/loot_tables/blocks/dirt.json')).toBe(
      'loot_table_json',
    );
    expect(detectVanillaFileKind('data/minecraft/tags/items/logs.json')).toBe('tag_json');
    expect(detectVanillaFileKind('data/minecraft/advancements/story/root.json')).toBe(
      'advancement_json',
    );
    expect(detectVanillaFileKind('data/foo/functions/bar.mcfunction')).toBe('function_mcfunction');
    expect(detectVanillaFileKind('data/minecraft/worldgen/biome/plains.json')).toBe('biome_json');
    expect(detectVanillaFileKind('data/minecraft/dimension/overworld.json')).toBe('dimension_json');
    expect(detectVanillaFileKind('assets/minecraft/blockstates/stone.json')).toBe(
      'blockstate_json',
    );
    expect(detectVanillaFileKind('assets/minecraft/models/block/stone.json')).toBe('model_json');
    expect(detectVanillaFileKind('server.properties')).toBe('server_properties');
    expect(detectVanillaFileKind('assets/minecraft/lang/en_us.json')).toBe('lang_json');
    expect(detectVanillaFileKind('assets/minecraft/sounds.json')).toBe('sounds_json');
    expect(detectVanillaFileKind('options.txt')).toBe('options_txt');
    expect(detectVanillaFileKind('assets/minecraft/textures/block/water_still.png.mcmeta')).toBe(
      'animation_mcmeta',
    );
    expect(detectVanillaFileKind('readme.md')).toBe('unknown');
  });

  it('re-exports the named parsers and they work', () => {
    expect(typeof parseLevelDat).toBe('function');
    expect(typeof parsePackMcmeta).toBe('function');
    expect(typeof parseVanillaRecipe).toBe('function');
    expect(typeof parseVanillaTag).toBe('function');
    expect(typeof parseVanillaLootTable).toBe('function');
    expect(typeof encodeNbt).toBe('function');
    expect(typeof decodeNbt).toBe('function');
    expect(mapVanillaName('minecraft:stone')).toBe('webmc:stone');
    expect(mapVanillaItemName('minecraft:stick')).toBe('webmc:stick');
  });
});
