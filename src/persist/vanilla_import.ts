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
  if (n.endsWith('.json')) {
    // Best-effort routing: look at the path. recipes/, loot_tables/, tags/.
    if (/(\/|^)recipes?\//.test(n)) return 'recipe_json';
    if (/(\/|^)loot_tables?\//.test(n)) return 'loot_table_json';
    if (/(\/|^)tags\//.test(n)) return 'tag_json';
    if (/(\/|^)advancements?\//.test(n)) return 'advancement_json';
  }
  return 'unknown';
}
