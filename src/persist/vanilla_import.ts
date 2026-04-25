// Vanilla import barrel: convenience re-exports + a top-level dispatcher
// that picks the right parser based on file name. Consumers can use this
// instead of remembering the half-dozen module names.

export { decodeNbt, type NbtRoot } from './nbt_decode';
export { encodeNbt } from './nbt_encode';
export { gunzip, inflateZlib, decodeGzippedNbt } from './nbt_gzip';
export { parseLevelDat, sanitizeForImport, type LevelDatFields } from './level_dat_fields';
export {
  importVanillaChunk,
  type ChunkImportResult,
  type BlockResolver,
} from './anvil_chunk_to_webmc';
export { extractChunkFromRegion, readChunkPayload, decodeChunkNbt } from './anvil_chunk_extract';
export {
  parseChunkSections,
  parseSection,
  blockIndex,
  type AnvilSection,
  type PaletteEntry,
} from './anvil_section_parse';
export { mapVanillaName, resolveVanillaName } from './vanilla_block_map';
export { mapVanillaItemName, resolveVanillaItem } from './vanilla_item_map';
export { mapWebmcToVanillaName } from './webmc_to_vanilla_block_map';
export { mapWebmcToVanillaItemName } from './webmc_to_vanilla_item_map';
export { encodeSection, packIndices, type SectionEncodeInput } from './anvil_section_encode';
export { encodeChunkRoot, type ChunkEncodeInput } from './anvil_chunk_encode';
export { writeRegion, type RegionWriteEntry, type CompressionType } from './anvil_region_write';
export { parsePackMcmeta, PackMetaError, type PackMeta } from './pack_mcmeta';
export {
  parseStructureFromNbt,
  parseStructureBytes,
  type ParsedStructure,
} from './structure_block_parse';
export {
  parseVanillaRecipe,
  RecipeParseError,
  type ParsedRecipe,
  type ShapedRecipe,
  type ShapelessRecipe,
  type CookingRecipe,
} from './vanilla_recipe_parse';
export { parseVanillaTag, TagParseError, type ParsedTag } from './vanilla_tag_parse';
export {
  parseVanillaLootTable,
  LootParseError,
  type ParsedLootTable,
  type LootPool,
  type LootEntry,
} from './vanilla_loot_parse';
export { parseSnbt, type SnbtValue } from './snbt_parse';
export { snbtValueToNbtValue } from './snbt_to_nbt';
export { serializeSnbt } from './snbt_serialize';
export {
  parseVanillaAdvancement,
  AdvancementParseError,
  type ParsedAdvancement,
  type AdvancementCriterion,
  type AdvancementFrame,
} from './vanilla_advancement_parse';
export { parseVanillaFunction, type ParsedFunction } from './vanilla_function_parse';
export { flattenTextComponent } from './text_component';
export {
  parseVanillaBiome,
  BiomeParseError,
  type ParsedBiome,
  type BiomeEffects,
  type BiomeSpawnerEntry,
  type BiomeSpawnerCategory,
} from './vanilla_biome_parse';
export {
  parseVanillaDimension,
  DimensionParseError,
  type ParsedDimension,
  type GeneratorKind,
} from './vanilla_dimension_parse';
export {
  parseVanillaBlockstate,
  BlockstateParseError,
  type ParsedBlockstate,
  type ModelRef,
  type VariantBranch,
  type MultipartCase,
} from './vanilla_blockstate_parse';
export {
  parseVanillaModel,
  ModelParseError,
  type ParsedModel,
  type ModelElement,
  type ModelFace,
} from './vanilla_model_parse';
export {
  parseServerProperties,
  type ParsedServerProperties,
  type PropertyValue,
} from './server_properties_parse';
export { parseVanillaLang, translate, LangParseError, type ParsedLang } from './vanilla_lang_parse';
export {
  parseVanillaSoundsJson,
  SoundsParseError,
  type ParsedSoundsJson,
  type SoundEvent,
  type SoundVariant,
} from './vanilla_sounds_parse';
export {
  resourcePackVersion,
  dataPackVersion,
  KNOWN_RESOURCE_PACK_FORMATS,
  KNOWN_DATA_PACK_FORMATS,
} from './pack_format_versions';
export {
  parseVanillaOptionsTxt,
  type ParsedOptionsTxt,
  type OptionValue,
} from './vanilla_options_parse';
export {
  parseVanillaAnimationMcmeta,
  frameDurations,
  totalAnimationTicks,
  AnimationMcmetaParseError,
  type ParsedAnimationMcmeta,
  type AnimationFrame,
} from './vanilla_animation_mcmeta_parse';
export {
  importVanillaPack,
  type PackImportEntry,
  type PackImportReport,
  type PackImportError,
} from './vanilla_pack_import';
export {
  SKIN_LAYOUT_64X64,
  SKIN_LAYOUT_64X32,
  pickSkinLayout,
  type SkinLayout,
  type Rect,
} from './vanilla_skin_layout';
export {
  parseVanillaEnchantment,
  EnchantmentParseError,
  type ParsedEnchantment,
  type CostScale,
} from './vanilla_enchantment_parse';
export {
  parseVanillaDamageType,
  DamageTypeParseError,
  type ParsedDamageType,
  type DamageScaling,
  type DamageEffectKind,
} from './vanilla_damage_type_parse';
export {
  parseVanillaChatType,
  ChatTypeParseError,
  type ParsedChatType,
  type ChatTypeDecoration,
  type ChatTypeParameter,
} from './vanilla_chat_type_parse';
export { parseVanillaSplashes, pickSplash, type ParsedSplashes } from './vanilla_splashes_parse';
export {
  parseVanillaPaintingVariant,
  PaintingVariantParseError,
  type ParsedPaintingVariant,
} from './vanilla_painting_variant_parse';
export {
  parseVanillaTrimPattern,
  parseVanillaTrimMaterial,
  TrimParseError,
  type ParsedTrimPattern,
  type ParsedTrimMaterial,
} from './vanilla_trim_parse';
export {
  parseVanillaMobVariant,
  MobVariantParseError,
  type ParsedMobVariant,
  type VariantSpawnCondition,
} from './vanilla_mob_variant_parse';
export {
  parseVanillaBannerPattern,
  BannerPatternParseError,
  type ParsedBannerPattern,
} from './vanilla_banner_pattern_parse';
export {
  parseVanillaInstrument,
  InstrumentParseError,
  type ParsedInstrument,
} from './vanilla_instrument_parse';
export {
  parseVanillaAtlas,
  AtlasParseError,
  type ParsedAtlas,
  type AtlasSource,
  type AtlasSourceKind,
} from './vanilla_atlas_parse';
export {
  parseVanillaPredicate,
  PredicateParseError,
  type ParsedPredicate,
} from './vanilla_predicate_parse';
export {
  parseVanillaFont,
  FontParseError,
  type ParsedFont,
  type FontProvider,
  type FontProviderKind,
} from './vanilla_font_parse';
export {
  parseVanillaItemModifier,
  ItemModifierParseError,
  type ParsedItemModifier,
} from './vanilla_item_modifier_parse';
export {
  parseVanillaWorldPreset,
  WorldPresetParseError,
  type ParsedWorldPreset,
} from './vanilla_world_preset_parse';
export {
  parseVanillaFlatPreset,
  FlatPresetParseError,
  type ParsedFlatPreset,
  type FlatLayer,
} from './vanilla_flat_preset_parse';
export {
  parseVanillaConfiguredFeature,
  parseVanillaPlacedFeature,
  FeatureParseError,
  type ParsedConfiguredFeature,
  type ParsedPlacedFeature,
  type PlacementModifier,
} from './vanilla_feature_parse';
export {
  parseVanillaStructureJson,
  StructureJsonParseError,
  type ParsedStructureJson,
} from './vanilla_structure_json_parse';
export {
  parseVanillaTemplatePool,
  TemplatePoolParseError,
  type ParsedTemplatePool,
  type TemplatePoolEntry,
} from './vanilla_template_pool_parse';
export {
  parseVanillaProcessorList,
  ProcessorListParseError,
  type ParsedProcessorList,
  type ParsedProcessor,
} from './vanilla_processor_list_parse';
export {
  parseVanillaNoiseSettings,
  NoiseSettingsParseError,
  type ParsedNoiseSettings,
  type NoiseShape,
} from './vanilla_noise_settings_parse';
export {
  parseVanillaMultiNoise,
  MultiNoiseParseError,
  type ParsedMultiNoiseBiomeSource,
  type MultiNoiseBiomeEntry,
} from './vanilla_multi_noise_parse';
export {
  parseVanillaJukeboxSong,
  JukeboxSongParseError,
  type ParsedJukeboxSong,
} from './vanilla_jukebox_song_parse';
export {
  parseVanillaDensityFunction,
  DensityFunctionParseError,
  type ParsedDensityFunction,
} from './vanilla_density_function_parse';
export {
  parseVanillaGuiSpriteMcmeta,
  GuiSpriteMcmetaParseError,
  type ParsedGuiSpriteMcmeta,
  type GuiBorder,
  type GuiScalingType,
} from './vanilla_gui_sprite_parse';

export type VanillaFileKind =
  | 'level_dat'
  | 'mca_region'
  | 'structure_nbt'
  | 'recipe_json'
  | 'tag_json'
  | 'loot_table_json'
  | 'pack_mcmeta'
  | 'advancement_json'
  | 'function_mcfunction'
  | 'biome_json'
  | 'dimension_json'
  | 'blockstate_json'
  | 'model_json'
  | 'server_properties'
  | 'lang_json'
  | 'sounds_json'
  | 'options_txt'
  | 'animation_mcmeta'
  | 'enchantment_json'
  | 'damage_type_json'
  | 'chat_type_json'
  | 'splashes_txt'
  | 'painting_variant_json'
  | 'trim_pattern_json'
  | 'trim_material_json'
  | 'wolf_variant_json'
  | 'cat_variant_json'
  | 'frog_variant_json'
  | 'pig_variant_json'
  | 'cow_variant_json'
  | 'chicken_variant_json'
  | 'banner_pattern_json'
  | 'instrument_json'
  | 'atlas_json'
  | 'predicate_json'
  | 'font_json'
  | 'item_modifier_json'
  | 'world_preset_json'
  | 'flat_level_generator_preset_json'
  | 'configured_feature_json'
  | 'placed_feature_json'
  | 'structure_json'
  | 'template_pool_json'
  | 'processor_list_json'
  | 'noise_settings_json'
  | 'multi_noise_biome_source_parameter_list_json'
  | 'jukebox_song_json'
  | 'density_function_json'
  | 'unknown';

// Heuristic: detect a vanilla file kind from its filename. Useful for
// routing dropped uploads to the right parser without forcing the user
// to pick a format.
export function detectVanillaFileKind(name: string): VanillaFileKind {
  const n = name.toLowerCase();
  if (n.endsWith('level.dat')) return 'level_dat';
  if (n.endsWith('.mca')) return 'mca_region';
  if (n.endsWith('.nbt')) return 'structure_nbt';
  if (n === 'pack.mcmeta' || n.endsWith('/pack.mcmeta')) return 'pack_mcmeta';
  if (n.endsWith('.mcfunction')) return 'function_mcfunction';
  if (n.endsWith('server.properties') || n.endsWith('/server.properties'))
    return 'server_properties';
  if (n.endsWith('options.txt') || n.endsWith('/options.txt')) return 'options_txt';
  if (n.endsWith('.png.mcmeta')) return 'animation_mcmeta';
  if (n.endsWith('splashes.txt') || n.endsWith('/splashes.txt')) return 'splashes_txt';
  if (n.endsWith('.json')) {
    // Best-effort routing: look at the path. recipes/, loot_tables/, tags/.
    if (/(\/|^)recipes?\//.test(n)) return 'recipe_json';
    if (/(\/|^)loot_tables?\//.test(n)) return 'loot_table_json';
    if (/(\/|^)tags\//.test(n)) return 'tag_json';
    if (/(\/|^)advancements?\//.test(n)) return 'advancement_json';
    if (/(\/|^)worldgen\/biome\//.test(n)) return 'biome_json';
    if (/(\/|^)dimension\//.test(n)) return 'dimension_json';
    if (/(\/|^)blockstates\//.test(n)) return 'blockstate_json';
    if (/(\/|^)models\//.test(n)) return 'model_json';
    if (/(\/|^)lang\//.test(n)) return 'lang_json';
    if (n.endsWith('/sounds.json') || n === 'sounds.json') return 'sounds_json';
    if (/(\/|^)enchantment\//.test(n)) return 'enchantment_json';
    if (/(\/|^)damage_type\//.test(n)) return 'damage_type_json';
    if (/(\/|^)chat_type\//.test(n)) return 'chat_type_json';
    if (/(\/|^)painting_variant\//.test(n)) return 'painting_variant_json';
    if (/(\/|^)trim_pattern\//.test(n)) return 'trim_pattern_json';
    if (/(\/|^)trim_material\//.test(n)) return 'trim_material_json';
    if (/(\/|^)wolf_variant\//.test(n)) return 'wolf_variant_json';
    if (/(\/|^)cat_variant\//.test(n)) return 'cat_variant_json';
    if (/(\/|^)frog_variant\//.test(n)) return 'frog_variant_json';
    if (/(\/|^)pig_variant\//.test(n)) return 'pig_variant_json';
    if (/(\/|^)cow_variant\//.test(n)) return 'cow_variant_json';
    if (/(\/|^)chicken_variant\//.test(n)) return 'chicken_variant_json';
    if (/(\/|^)banner_pattern\//.test(n)) return 'banner_pattern_json';
    if (/(\/|^)instrument\//.test(n)) return 'instrument_json';
    if (/(\/|^)atlases\//.test(n)) return 'atlas_json';
    if (/(\/|^)predicates?\//.test(n)) return 'predicate_json';
    if (/(\/|^)font\//.test(n)) return 'font_json';
    if (/(\/|^)item_modifiers?\//.test(n)) return 'item_modifier_json';
    if (/(\/|^)worldgen\/world_preset\//.test(n)) return 'world_preset_json';
    if (/(\/|^)worldgen\/flat_level_generator_preset\//.test(n))
      return 'flat_level_generator_preset_json';
    if (/(\/|^)worldgen\/configured_feature\//.test(n)) return 'configured_feature_json';
    if (/(\/|^)worldgen\/placed_feature\//.test(n)) return 'placed_feature_json';
    if (/(\/|^)worldgen\/structure\//.test(n)) return 'structure_json';
    if (/(\/|^)worldgen\/template_pool\//.test(n)) return 'template_pool_json';
    if (/(\/|^)worldgen\/processor_list\//.test(n)) return 'processor_list_json';
    if (/(\/|^)worldgen\/noise_settings\//.test(n)) return 'noise_settings_json';
    if (/(\/|^)worldgen\/multi_noise_biome_source_parameter_list\//.test(n))
      return 'multi_noise_biome_source_parameter_list_json';
    if (/(\/|^)worldgen\/density_function\//.test(n)) return 'density_function_json';
    if (/(\/|^)jukebox_song\//.test(n)) return 'jukebox_song_json';
  }
  return 'unknown';
}
