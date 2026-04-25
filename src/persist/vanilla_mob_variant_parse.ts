// Parse vanilla mob variant JSONs (1.20.5+ datapack format).
//
// Wolf, cat, frog, chicken, cow, pig and similar entity variants share
// nearly the same structure: an `asset_id` (texture path) plus
// optional `spawn_conditions` (biome/structure/etc constraints) and a
// model selector. We share one parser since the schema is uniform.
//
// Source: minecraft.wiki "Wolf variant" / "Cat variant". Behavioral
// spec — clean-room.

import { mapVanillaItemName } from './vanilla_item_map';

export interface VariantSpawnCondition {
  // The "condition" type (e.g. minecraft:tag, minecraft:structure).
  type: string;
  // Free-form raw object so callers can introspect what they need.
  raw: Record<string, unknown>;
}

export interface ParsedMobVariant {
  // Texture asset id, mapped to webmc namespace.
  assetId: string;
  // Optional model spec (wolf has "model": "normal"|"angry"|"big" etc).
  model: string | null;
  // Spawn conditions list, one entry per condition object.
  spawnConditions: VariantSpawnCondition[];
}

export class MobVariantParseError extends Error {}

function readSpawnConditions(v: unknown): VariantSpawnCondition[] {
  if (!Array.isArray(v)) return [];
  const out: VariantSpawnCondition[] = [];
  for (const e of v) {
    if (typeof e !== 'object' || e === null) continue;
    const o = e as Record<string, unknown>;
    let type =
      typeof o['type'] === 'string'
        ? o['type']
        : typeof o['condition'] === 'string'
          ? o['condition']
          : '';
    if (type) type = `webmc:${type.replace(/^minecraft:/, '')}`;
    out.push({ type, raw: o });
  }
  return out;
}

export function parseVanillaMobVariant(text: string): ParsedMobVariant {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new MobVariantParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new MobVariantParseError('mob variant must be an object');
  const o = json as Record<string, unknown>;
  const rawAsset = typeof o['asset_id'] === 'string' ? o['asset_id'] : '';
  return {
    assetId: rawAsset ? mapVanillaItemName(rawAsset) : '',
    model: typeof o['model'] === 'string' ? o['model'] : null,
    spawnConditions: readSpawnConditions(o['spawn_conditions']),
  };
}
