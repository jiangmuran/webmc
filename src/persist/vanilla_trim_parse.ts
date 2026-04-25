// Parse vanilla armor trim JSON (1.20+). Two related types share most
// fields; we bundle them here.
//
// trim_pattern:
//   { "asset_id": "minecraft:sentry", "description": <text>, "template_item": "minecraft:sentry_armor_trim_smithing_template" }
//
// trim_material:
//   { "asset_name": "iron", "description": <text>, "ingredient": "minecraft:iron_ingot",
//     "item_model_index": 0.1, "override_armor_assets": {...} }
//
// Source: minecraft.wiki "Armor trim". Behavioral spec — clean-room.

import { flattenTextComponent } from './text_component';
import { mapVanillaItemName } from './vanilla_item_map';

export interface ParsedTrimPattern {
  assetId: string; // webmc:-namespaced
  description: string;
  templateItem: string;
}

export interface ParsedTrimMaterial {
  assetName: string;
  description: string;
  ingredient: string; // webmc:-namespaced
  itemModelIndex: number;
}

export class TrimParseError extends Error {}

export function parseVanillaTrimPattern(text: string): ParsedTrimPattern {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new TrimParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new TrimParseError('trim_pattern must be an object');
  const o = json as Record<string, unknown>;
  const rawAsset = typeof o['asset_id'] === 'string' ? o['asset_id'] : '';
  const rawTemplate = typeof o['template_item'] === 'string' ? o['template_item'] : '';
  return {
    assetId: rawAsset ? `webmc:${rawAsset.replace(/^minecraft:/, '')}` : '',
    description: flattenTextComponent(o['description']),
    templateItem: rawTemplate ? mapVanillaItemName(rawTemplate) : '',
  };
}

export function parseVanillaTrimMaterial(text: string): ParsedTrimMaterial {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new TrimParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new TrimParseError('trim_material must be an object');
  const o = json as Record<string, unknown>;
  const rawIngredient = typeof o['ingredient'] === 'string' ? o['ingredient'] : '';
  return {
    assetName: typeof o['asset_name'] === 'string' ? o['asset_name'] : '',
    description: flattenTextComponent(o['description']),
    ingredient: rawIngredient ? mapVanillaItemName(rawIngredient) : '',
    itemModelIndex: typeof o['item_model_index'] === 'number' ? o['item_model_index'] : 0,
  };
}
