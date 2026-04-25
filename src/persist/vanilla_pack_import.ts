// Top-level vanilla pack importer. Takes a list of (path, bytes)
// entries (typically from a .zip uploaded by the user) and routes each
// through the right parser, accumulating the results into a single
// import report. Skips unknown files instead of failing — packs often
// contain extra README files, .git artifacts, etc.

import { detectVanillaFileKind, type VanillaFileKind } from './vanilla_import';
import { parsePackMcmeta, type PackMeta } from './pack_mcmeta';
import { parseVanillaRecipe, type ParsedRecipe } from './vanilla_recipe_parse';
import { parseVanillaTag, type ParsedTag } from './vanilla_tag_parse';
import { parseVanillaLootTable, type ParsedLootTable } from './vanilla_loot_parse';
import { parseVanillaAdvancement, type ParsedAdvancement } from './vanilla_advancement_parse';
import { parseVanillaFunction, type ParsedFunction } from './vanilla_function_parse';
import { parseVanillaBiome, type ParsedBiome } from './vanilla_biome_parse';
import { parseVanillaDimension, type ParsedDimension } from './vanilla_dimension_parse';
import { parseVanillaBlockstate, type ParsedBlockstate } from './vanilla_blockstate_parse';
import { parseVanillaModel, type ParsedModel } from './vanilla_model_parse';
import { parseVanillaLang, type ParsedLang } from './vanilla_lang_parse';
import { parseVanillaSoundsJson, type ParsedSoundsJson } from './vanilla_sounds_parse';
import {
  parseVanillaAnimationMcmeta,
  type ParsedAnimationMcmeta,
} from './vanilla_animation_mcmeta_parse';

export interface PackImportEntry {
  path: string;
  // Either raw bytes (for binary formats: .nbt, .mca, .png, .dat) or text.
  // Caller is responsible for decoding text in the right charset.
  text?: string;
  bytes?: Uint8Array;
}

export interface PackImportError {
  path: string;
  kind: VanillaFileKind;
  message: string;
}

export interface PackImportReport {
  pack: PackMeta | null;
  recipes: { path: string; parsed: ParsedRecipe }[];
  tags: { path: string; parsed: ParsedTag }[];
  lootTables: { path: string; parsed: ParsedLootTable }[];
  advancements: { path: string; parsed: ParsedAdvancement }[];
  functions: { path: string; parsed: ParsedFunction }[];
  biomes: { path: string; parsed: ParsedBiome }[];
  dimensions: { path: string; parsed: ParsedDimension }[];
  blockstates: { path: string; parsed: ParsedBlockstate }[];
  models: { path: string; parsed: ParsedModel }[];
  lang: { path: string; parsed: ParsedLang }[];
  sounds: { path: string; parsed: ParsedSoundsJson }[];
  animations: { path: string; parsed: ParsedAnimationMcmeta }[];
  // Files we recognized but skipped (binary content currently routed through other paths).
  skipped: { path: string; kind: VanillaFileKind }[];
  // Files we didn't recognize at all.
  unknown: string[];
  errors: PackImportError[];
}

function newReport(): PackImportReport {
  return {
    pack: null,
    recipes: [],
    tags: [],
    lootTables: [],
    advancements: [],
    functions: [],
    biomes: [],
    dimensions: [],
    blockstates: [],
    models: [],
    lang: [],
    sounds: [],
    animations: [],
    skipped: [],
    unknown: [],
    errors: [],
  };
}

export function importVanillaPack(entries: readonly PackImportEntry[]): PackImportReport {
  const out = newReport();
  for (const e of entries) {
    const kind = detectVanillaFileKind(e.path);
    const text = e.text;
    try {
      switch (kind) {
        case 'pack_mcmeta': {
          if (text) out.pack = parsePackMcmeta(text);
          break;
        }
        case 'recipe_json': {
          if (text) out.recipes.push({ path: e.path, parsed: parseVanillaRecipe(text) });
          break;
        }
        case 'tag_json': {
          if (text) out.tags.push({ path: e.path, parsed: parseVanillaTag(text) });
          break;
        }
        case 'loot_table_json': {
          if (text) out.lootTables.push({ path: e.path, parsed: parseVanillaLootTable(text) });
          break;
        }
        case 'advancement_json': {
          if (text) out.advancements.push({ path: e.path, parsed: parseVanillaAdvancement(text) });
          break;
        }
        case 'function_mcfunction': {
          if (text) out.functions.push({ path: e.path, parsed: parseVanillaFunction(text) });
          break;
        }
        case 'biome_json': {
          if (text) out.biomes.push({ path: e.path, parsed: parseVanillaBiome(text) });
          break;
        }
        case 'dimension_json': {
          if (text) out.dimensions.push({ path: e.path, parsed: parseVanillaDimension(text) });
          break;
        }
        case 'blockstate_json': {
          if (text) out.blockstates.push({ path: e.path, parsed: parseVanillaBlockstate(text) });
          break;
        }
        case 'model_json': {
          if (text) out.models.push({ path: e.path, parsed: parseVanillaModel(text) });
          break;
        }
        case 'lang_json': {
          if (text) out.lang.push({ path: e.path, parsed: parseVanillaLang(text) });
          break;
        }
        case 'sounds_json': {
          if (text) out.sounds.push({ path: e.path, parsed: parseVanillaSoundsJson(text) });
          break;
        }
        case 'animation_mcmeta': {
          if (text)
            out.animations.push({ path: e.path, parsed: parseVanillaAnimationMcmeta(text) });
          break;
        }
        case 'level_dat':
        case 'mca_region':
        case 'structure_nbt':
        case 'server_properties':
        case 'options_txt': {
          // Recognized but binary or routed through dedicated callers.
          out.skipped.push({ path: e.path, kind });
          break;
        }
        case 'unknown':
        default:
          out.unknown.push(e.path);
          break;
      }
    } catch (err) {
      out.errors.push({ path: e.path, kind, message: String(err) });
    }
  }
  return out;
}
