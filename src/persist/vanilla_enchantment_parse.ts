// Parse a vanilla enchantment JSON (1.20.5+ datapack format). Schema:
//   {
//     "description": "Sharpness" | { ...text component },
//     "anvil_cost": <int=1>,
//     "max_level": <int>,
//     "min_cost": { "base": <int>, "per_level_above_first": <int> },
//     "max_cost": { "base": <int>, "per_level_above_first": <int> },
//     "weight": <int=1>,
//     "primary_items": "#minecraft:enchantable/sharp_weapon",
//     "supported_items": "#minecraft:enchantable/weapon",
//     "exclusive_set": "#minecraft:exclusive_set/damage",
//     "slots": ["mainhand"]
//   }
//
// Source: minecraft.wiki "Enchantment". Behavioral spec — clean-room.

import { flattenTextComponent } from './text_component';
import { mapVanillaItemName } from './vanilla_item_map';

export interface CostScale {
  base: number;
  perLevelAboveFirst: number;
}

export interface ParsedEnchantment {
  description: string;
  anvilCost: number;
  maxLevel: number;
  minCost: CostScale;
  maxCost: CostScale;
  weight: number;
  primaryItems: string | null; // "#webmc:..." for tag, "webmc:..." for direct, null when missing
  supportedItems: string | null;
  exclusiveSet: string | null;
  slots: string[];
}

export class EnchantmentParseError extends Error {}

function readCostScale(v: unknown): CostScale {
  if (typeof v !== 'object' || v === null) return { base: 1, perLevelAboveFirst: 0 };
  const o = v as Record<string, unknown>;
  return {
    base: typeof o['base'] === 'number' ? Math.trunc(o['base']) : 1,
    perLevelAboveFirst:
      typeof o['per_level_above_first'] === 'number' ? Math.trunc(o['per_level_above_first']) : 0,
  };
}

function readItemRef(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  if (v.startsWith('#')) return `#${mapVanillaItemName(v.slice(1))}`;
  return mapVanillaItemName(v);
}

export function parseVanillaEnchantment(text: string): ParsedEnchantment {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new EnchantmentParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new EnchantmentParseError('enchantment must be an object');
  const o = json as Record<string, unknown>;
  const slots: string[] = [];
  if (Array.isArray(o['slots']))
    for (const s of o['slots']) if (typeof s === 'string') slots.push(s);
  return {
    description: flattenTextComponent(o['description']),
    anvilCost: typeof o['anvil_cost'] === 'number' ? Math.trunc(o['anvil_cost']) : 1,
    maxLevel: typeof o['max_level'] === 'number' ? Math.trunc(o['max_level']) : 1,
    minCost: readCostScale(o['min_cost']),
    maxCost: readCostScale(o['max_cost']),
    weight: typeof o['weight'] === 'number' ? Math.trunc(o['weight']) : 1,
    primaryItems: readItemRef(o['primary_items']),
    supportedItems: readItemRef(o['supported_items']),
    exclusiveSet: readItemRef(o['exclusive_set']),
    slots,
  };
}
