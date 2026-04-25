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
  }
  return 'unknown';
}
