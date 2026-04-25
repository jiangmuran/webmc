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

  it('routes worldgen + variant content into the new buckets', () => {
    const r = importVanillaPack([
      {
        path: 'data/minecraft/painting_variant/bust.json',
        text: JSON.stringify({ asset_id: 'minecraft:bust', width: 2, height: 2 }),
      },
      {
        path: 'data/minecraft/trim_pattern/sentry.json',
        text: JSON.stringify({ asset_id: 'minecraft:sentry' }),
      },
      {
        path: 'data/minecraft/trim_material/iron.json',
        text: JSON.stringify({ asset_name: 'iron', ingredient: 'minecraft:iron_ingot' }),
      },
      {
        path: 'data/minecraft/wolf_variant/pale.json',
        text: JSON.stringify({ asset_id: 'minecraft:entity/wolf/wolf_pale' }),
      },
      {
        path: 'data/minecraft/banner_pattern/bricks.json',
        text: JSON.stringify({ asset_id: 'minecraft:bricks' }),
      },
      {
        path: 'data/minecraft/instrument/ponder.json',
        text: JSON.stringify({ sound_event: 'minecraft:item.goat_horn.sound.0' }),
      },
      {
        path: 'assets/minecraft/atlases/blocks.json',
        text: JSON.stringify({ sources: [{ type: 'minecraft:directory', source: 'block' }] }),
      },
      {
        path: 'data/minecraft/predicates/chance.json',
        text: JSON.stringify({ condition: 'minecraft:random_chance', chance: 0.5 }),
      },
      {
        path: 'assets/minecraft/font/default.json',
        text: JSON.stringify({ providers: [{ type: 'bitmap' }] }),
      },
      {
        path: 'data/minecraft/item_modifiers/foo.json',
        text: JSON.stringify({ function: 'minecraft:set_count', count: 3 }),
      },
      {
        path: 'data/minecraft/worldgen/world_preset/normal.json',
        text: JSON.stringify({ dimensions: {} }),
      },
      {
        path: 'data/minecraft/worldgen/flat_level_generator_preset/classic_flat.json',
        text: JSON.stringify({ biome: 'minecraft:plains', layers: [] }),
      },
      {
        path: 'data/minecraft/worldgen/configured_feature/oak.json',
        text: JSON.stringify({ type: 'minecraft:tree' }),
      },
      {
        path: 'data/minecraft/worldgen/placed_feature/trees_oak.json',
        text: JSON.stringify({ feature: 'minecraft:trees_oak', placement: [] }),
      },
      {
        path: 'data/minecraft/worldgen/structure/village.json',
        text: JSON.stringify({ type: 'minecraft:jigsaw' }),
      },
      {
        path: 'data/minecraft/worldgen/template_pool/houses.json',
        text: JSON.stringify({ name: 'minecraft:houses', fallback: 'minecraft:empty' }),
      },
      {
        path: 'data/minecraft/worldgen/processor_list/foo.json',
        text: JSON.stringify({ processors: [{ processor_type: 'minecraft:rule' }] }),
      },
      {
        path: 'data/minecraft/worldgen/noise_settings/overworld.json',
        text: JSON.stringify({ sea_level: 63 }),
      },
      {
        path: 'data/minecraft/worldgen/multi_noise_biome_source_parameter_list/overworld.json',
        text: JSON.stringify({ preset: 'minecraft:overworld' }),
      },
      { path: 'data/minecraft/worldgen/density_function/foo.json', text: '0.5' },
      {
        path: 'data/minecraft/jukebox_song/13.json',
        text: JSON.stringify({ sound_event: 'minecraft:music_disc.13' }),
      },
    ]);
    expect(r.paintingVariants).toHaveLength(1);
    expect(r.trimPatterns).toHaveLength(1);
    expect(r.trimMaterials).toHaveLength(1);
    expect(r.mobVariants).toHaveLength(1);
    expect(r.bannerPatterns).toHaveLength(1);
    expect(r.instruments).toHaveLength(1);
    expect(r.atlases).toHaveLength(1);
    expect(r.predicates).toHaveLength(1);
    expect(r.fonts).toHaveLength(1);
    expect(r.itemModifiers).toHaveLength(1);
    expect(r.worldPresets).toHaveLength(1);
    expect(r.flatPresets).toHaveLength(1);
    expect(r.configuredFeatures).toHaveLength(1);
    expect(r.placedFeatures).toHaveLength(1);
    expect(r.structures).toHaveLength(1);
    expect(r.templatePools).toHaveLength(1);
    expect(r.processorLists).toHaveLength(1);
    expect(r.noiseSettings).toHaveLength(1);
    expect(r.multiNoiseSources).toHaveLength(1);
    expect(r.densityFunctions).toHaveLength(1);
    expect(r.jukeboxSongs).toHaveLength(1);
    expect(r.errors).toEqual([]);
  });

  it('routes 1.20.5+ datapack content (enchantments, damage_type, chat_type, splashes)', () => {
    const r = importVanillaPack([
      {
        path: 'data/minecraft/enchantment/sharpness.json',
        text: JSON.stringify({
          description: 'Sharpness',
          max_level: 5,
          min_cost: { base: 1, per_level_above_first: 11 },
          max_cost: { base: 21, per_level_above_first: 11 },
        }),
      },
      {
        path: 'data/minecraft/damage_type/drown.json',
        text: JSON.stringify({ message_id: 'drown', effects: 'drowning' }),
      },
      {
        path: 'data/minecraft/chat_type/chat.json',
        text: JSON.stringify({
          chat: { translation_key: 'chat.type.text', parameters: ['sender', 'content'] },
        }),
      },
      { path: 'assets/minecraft/texts/splashes.txt', text: 'Hi!\nMore splashes!\n' },
    ]);
    expect(r.enchantments).toHaveLength(1);
    expect(r.enchantments[0]?.parsed.description).toBe('Sharpness');
    expect(r.damageTypes).toHaveLength(1);
    expect(r.damageTypes[0]?.parsed.effects).toBe('drowning');
    expect(r.chatTypes).toHaveLength(1);
    expect(r.chatTypes[0]?.parsed.chat.parameters).toEqual(['sender', 'content']);
    expect(r.splashes).toHaveLength(1);
    expect(r.splashes[0]?.parsed.lines).toEqual(['Hi!', 'More splashes!']);
    expect(r.errors).toEqual([]);
  });
});
