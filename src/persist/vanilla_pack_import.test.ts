import { describe, it, expect } from 'vitest';
import { importVanillaPack } from './vanilla_pack_import';

describe('vanilla pack importer', () => {
  it('routes a mixed datapack through the right parsers', () => {
    const r = importVanillaPack([
      { path: 'pack.mcmeta', text: '{"pack":{"pack_format":15,"description":"d"}}' },
      {
        path: 'data/minecraft/recipes/torch.json',
        text: JSON.stringify({
          type: 'minecraft:crafting_shaped',
          pattern: ['X'],
          key: { X: { item: 'minecraft:stick' } },
          result: { item: 'minecraft:torch', count: 4 },
        }),
      },
      {
        path: 'data/minecraft/tags/items/logs.json',
        text: JSON.stringify({ values: ['minecraft:oak_log'] }),
      },
      {
        path: 'data/minecraft/loot_tables/blocks/stone.json',
        text: JSON.stringify({
          type: 'minecraft:block',
          pools: [
            { rolls: 1, entries: [{ type: 'minecraft:item', name: 'minecraft:cobblestone' }] },
          ],
        }),
      },
      {
        path: 'data/minecraft/advancements/story/root.json',
        text: JSON.stringify({
          display: { title: 'Hi', description: '', icon: { item: 'minecraft:dirt' } },
          criteria: { x: { trigger: 'minecraft:impossible' } },
        }),
      },
      { path: 'data/test/functions/hello.mcfunction', text: 'say hi\n' },
      {
        path: 'data/minecraft/worldgen/biome/plains.json',
        text: JSON.stringify({ temperature: 0.7 }),
      },
      {
        path: 'data/minecraft/dimension/overworld.json',
        text: JSON.stringify({
          type: 'minecraft:overworld',
          generator: { type: 'minecraft:noise' },
        }),
      },
      {
        path: 'assets/minecraft/blockstates/stone.json',
        text: JSON.stringify({ variants: { '': { model: 'minecraft:block/stone' } } }),
      },
      {
        path: 'assets/minecraft/models/block/stone.json',
        text: JSON.stringify({ parent: 'minecraft:block/cube_all' }),
      },
      { path: 'assets/minecraft/lang/en_us.json', text: '{"block.minecraft.stone":"Stone"}' },
      {
        path: 'assets/minecraft/sounds.json',
        text: '{"block.stone.break":{"sounds":["block/stone/break1"]}}',
      },
      {
        path: 'assets/minecraft/textures/block/water_still.png.mcmeta',
        text: '{"animation":{"frametime":2,"frames":[0,1,2]}}',
      },
      { path: 'README.md', text: '# unrelated' },
    ]);
    expect(r.pack?.packFormat).toBe(15);
    expect(r.recipes).toHaveLength(1);
    expect(r.tags).toHaveLength(1);
    expect(r.lootTables).toHaveLength(1);
    expect(r.advancements).toHaveLength(1);
    expect(r.functions).toHaveLength(1);
    expect(r.biomes).toHaveLength(1);
    expect(r.dimensions).toHaveLength(1);
    expect(r.blockstates).toHaveLength(1);
    expect(r.models).toHaveLength(1);
    expect(r.lang).toHaveLength(1);
    expect(r.sounds).toHaveLength(1);
    expect(r.animations).toHaveLength(1);
    expect(r.unknown).toEqual(['README.md']);
    expect(r.errors).toEqual([]);
  });

  it('reports per-file errors without aborting', () => {
    const r = importVanillaPack([
      { path: 'pack.mcmeta', text: '{not json' },
      {
        path: 'data/minecraft/recipes/ok.json',
        text: JSON.stringify({
          type: 'minecraft:crafting_shapeless',
          ingredients: [{ item: 'minecraft:wheat' }],
          result: 'minecraft:bread',
        }),
      },
    ]);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]?.kind).toBe('pack_mcmeta');
    expect(r.recipes).toHaveLength(1);
    expect(r.pack).toBeNull();
  });

  it('routes binary-format paths to skipped, not unknown', () => {
    const r = importVanillaPack([
      { path: 'level.dat', bytes: new Uint8Array() },
      { path: 'region/r.0.0.mca', bytes: new Uint8Array() },
      { path: 'structures/temple.nbt', bytes: new Uint8Array() },
      { path: 'options.txt', text: 'fov:0.5\n' },
    ]);
    expect(r.skipped.map((s) => s.kind).sort()).toEqual([
      'level_dat',
      'mca_region',
      'options_txt',
      'structure_nbt',
    ]);
    expect(r.unknown).toEqual([]);
  });
});
