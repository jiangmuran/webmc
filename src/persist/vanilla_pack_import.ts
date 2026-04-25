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
import { parseVanillaEnchantment, type ParsedEnchantment } from './vanilla_enchantment_parse';
import { parseVanillaDamageType, type ParsedDamageType } from './vanilla_damage_type_parse';
import { parseVanillaChatType, type ParsedChatType } from './vanilla_chat_type_parse';
import { parseVanillaSplashes, type ParsedSplashes } from './vanilla_splashes_parse';
import {
  parseVanillaPaintingVariant,
  type ParsedPaintingVariant,
} from './vanilla_painting_variant_parse';
import {
  parseVanillaTrimPattern,
  parseVanillaTrimMaterial,
  type ParsedTrimPattern,
  type ParsedTrimMaterial,
} from './vanilla_trim_parse';
import { parseVanillaMobVariant, type ParsedMobVariant } from './vanilla_mob_variant_parse';
import {
  parseVanillaBannerPattern,
  type ParsedBannerPattern,
} from './vanilla_banner_pattern_parse';
import { parseVanillaInstrument, type ParsedInstrument } from './vanilla_instrument_parse';
import { parseVanillaAtlas, type ParsedAtlas } from './vanilla_atlas_parse';
import { parseVanillaPredicate, type ParsedPredicate } from './vanilla_predicate_parse';
import { parseVanillaFont, type ParsedFont } from './vanilla_font_parse';
import { parseVanillaItemModifier, type ParsedItemModifier } from './vanilla_item_modifier_parse';
import { parseVanillaWorldPreset, type ParsedWorldPreset } from './vanilla_world_preset_parse';
import { parseVanillaFlatPreset, type ParsedFlatPreset } from './vanilla_flat_preset_parse';
import {
  parseVanillaConfiguredFeature,
  parseVanillaPlacedFeature,
  type ParsedConfiguredFeature,
  type ParsedPlacedFeature,
} from './vanilla_feature_parse';
import {
  parseVanillaStructureJson,
  type ParsedStructureJson,
} from './vanilla_structure_json_parse';
import { parseVanillaTemplatePool, type ParsedTemplatePool } from './vanilla_template_pool_parse';
import {
  parseVanillaProcessorList,
  type ParsedProcessorList,
} from './vanilla_processor_list_parse';
import {
  parseVanillaNoiseSettings,
  type ParsedNoiseSettings,
} from './vanilla_noise_settings_parse';
import {
  parseVanillaMultiNoise,
  type ParsedMultiNoiseBiomeSource,
} from './vanilla_multi_noise_parse';
import { parseVanillaJukeboxSong, type ParsedJukeboxSong } from './vanilla_jukebox_song_parse';
import {
  parseVanillaDensityFunction,
  type ParsedDensityFunction,
} from './vanilla_density_function_parse';

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
  enchantments: { path: string; parsed: ParsedEnchantment }[];
  damageTypes: { path: string; parsed: ParsedDamageType }[];
  chatTypes: { path: string; parsed: ParsedChatType }[];
  splashes: { path: string; parsed: ParsedSplashes }[];
  paintingVariants: { path: string; parsed: ParsedPaintingVariant }[];
  trimPatterns: { path: string; parsed: ParsedTrimPattern }[];
  trimMaterials: { path: string; parsed: ParsedTrimMaterial }[];
  mobVariants: { path: string; parsed: ParsedMobVariant; kind: VanillaFileKind }[];
  bannerPatterns: { path: string; parsed: ParsedBannerPattern }[];
  instruments: { path: string; parsed: ParsedInstrument }[];
  atlases: { path: string; parsed: ParsedAtlas }[];
  predicates: { path: string; parsed: ParsedPredicate[] }[];
  fonts: { path: string; parsed: ParsedFont }[];
  itemModifiers: { path: string; parsed: ParsedItemModifier[] }[];
  worldPresets: { path: string; parsed: ParsedWorldPreset }[];
  flatPresets: { path: string; parsed: ParsedFlatPreset }[];
  configuredFeatures: { path: string; parsed: ParsedConfiguredFeature }[];
  placedFeatures: { path: string; parsed: ParsedPlacedFeature }[];
  structures: { path: string; parsed: ParsedStructureJson }[];
  templatePools: { path: string; parsed: ParsedTemplatePool }[];
  processorLists: { path: string; parsed: ParsedProcessorList }[];
  noiseSettings: { path: string; parsed: ParsedNoiseSettings }[];
  multiNoiseSources: { path: string; parsed: ParsedMultiNoiseBiomeSource }[];
  jukeboxSongs: { path: string; parsed: ParsedJukeboxSong }[];
  densityFunctions: { path: string; parsed: ParsedDensityFunction }[];
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
    enchantments: [],
    damageTypes: [],
    chatTypes: [],
    splashes: [],
    paintingVariants: [],
    trimPatterns: [],
    trimMaterials: [],
    mobVariants: [],
    bannerPatterns: [],
    instruments: [],
    atlases: [],
    predicates: [],
    fonts: [],
    itemModifiers: [],
    worldPresets: [],
    flatPresets: [],
    configuredFeatures: [],
    placedFeatures: [],
    structures: [],
    templatePools: [],
    processorLists: [],
    noiseSettings: [],
    multiNoiseSources: [],
    jukeboxSongs: [],
    densityFunctions: [],
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
        case 'enchantment_json': {
          if (text) out.enchantments.push({ path: e.path, parsed: parseVanillaEnchantment(text) });
          break;
        }
        case 'damage_type_json': {
          if (text) out.damageTypes.push({ path: e.path, parsed: parseVanillaDamageType(text) });
          break;
        }
        case 'chat_type_json': {
          if (text) out.chatTypes.push({ path: e.path, parsed: parseVanillaChatType(text) });
          break;
        }
        case 'splashes_txt': {
          if (text) out.splashes.push({ path: e.path, parsed: parseVanillaSplashes(text) });
          break;
        }
        case 'painting_variant_json': {
          if (text)
            out.paintingVariants.push({ path: e.path, parsed: parseVanillaPaintingVariant(text) });
          break;
        }
        case 'trim_pattern_json': {
          if (text) out.trimPatterns.push({ path: e.path, parsed: parseVanillaTrimPattern(text) });
          break;
        }
        case 'trim_material_json': {
          if (text)
            out.trimMaterials.push({ path: e.path, parsed: parseVanillaTrimMaterial(text) });
          break;
        }
        case 'wolf_variant_json':
        case 'cat_variant_json':
        case 'frog_variant_json':
        case 'pig_variant_json':
        case 'cow_variant_json':
        case 'chicken_variant_json': {
          if (text)
            out.mobVariants.push({
              path: e.path,
              parsed: parseVanillaMobVariant(text),
              kind,
            });
          break;
        }
        case 'banner_pattern_json': {
          if (text)
            out.bannerPatterns.push({ path: e.path, parsed: parseVanillaBannerPattern(text) });
          break;
        }
        case 'instrument_json': {
          if (text) out.instruments.push({ path: e.path, parsed: parseVanillaInstrument(text) });
          break;
        }
        case 'atlas_json': {
          if (text) out.atlases.push({ path: e.path, parsed: parseVanillaAtlas(text) });
          break;
        }
        case 'predicate_json': {
          if (text) out.predicates.push({ path: e.path, parsed: parseVanillaPredicate(text) });
          break;
        }
        case 'font_json': {
          if (text) out.fonts.push({ path: e.path, parsed: parseVanillaFont(text) });
          break;
        }
        case 'item_modifier_json': {
          if (text)
            out.itemModifiers.push({ path: e.path, parsed: parseVanillaItemModifier(text) });
          break;
        }
        case 'world_preset_json': {
          if (text) out.worldPresets.push({ path: e.path, parsed: parseVanillaWorldPreset(text) });
          break;
        }
        case 'flat_level_generator_preset_json': {
          if (text) out.flatPresets.push({ path: e.path, parsed: parseVanillaFlatPreset(text) });
          break;
        }
        case 'configured_feature_json': {
          if (text)
            out.configuredFeatures.push({
              path: e.path,
              parsed: parseVanillaConfiguredFeature(text),
            });
          break;
        }
        case 'placed_feature_json': {
          if (text)
            out.placedFeatures.push({ path: e.path, parsed: parseVanillaPlacedFeature(text) });
          break;
        }
        case 'structure_json': {
          if (text) out.structures.push({ path: e.path, parsed: parseVanillaStructureJson(text) });
          break;
        }
        case 'template_pool_json': {
          if (text)
            out.templatePools.push({ path: e.path, parsed: parseVanillaTemplatePool(text) });
          break;
        }
        case 'processor_list_json': {
          if (text)
            out.processorLists.push({ path: e.path, parsed: parseVanillaProcessorList(text) });
          break;
        }
        case 'noise_settings_json': {
          if (text)
            out.noiseSettings.push({ path: e.path, parsed: parseVanillaNoiseSettings(text) });
          break;
        }
        case 'multi_noise_biome_source_parameter_list_json': {
          if (text)
            out.multiNoiseSources.push({
              path: e.path,
              parsed: parseVanillaMultiNoise(text),
            });
          break;
        }
        case 'jukebox_song_json': {
          if (text) out.jukeboxSongs.push({ path: e.path, parsed: parseVanillaJukeboxSong(text) });
          break;
        }
        case 'density_function_json': {
          if (text)
            out.densityFunctions.push({
              path: e.path,
              parsed: parseVanillaDensityFunction(text),
            });
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
