// Parse a vanilla flat_level_generator_preset JSON. Flat presets list the
// stacked block layers used by a flat-world generator. Schema:
//   {
//     "biome": "minecraft:plains",
//     "lakes": <bool>,
//     "features": <bool>,
//     "structure_overrides": ["minecraft:village"],
//     "layers": [
//       { "block": "minecraft:bedrock",      "height": 1 },
//       { "block": "minecraft:dirt",         "height": 2 },
//       { "block": "minecraft:grass_block",  "height": 1 }
//     ]
//   }
//
// Source: minecraft.wiki "Custom dimension". Behavioral spec — clean-room.

import { mapVanillaName } from './vanilla_block_map';

export interface FlatLayer {
  block: string; // webmc-namespaced
  height: number;
}

export interface ParsedFlatPreset {
  biome: string; // bare biome id, e.g. "plains"
  lakes: boolean;
  features: boolean;
  structureOverrides: string[]; // bare structure ids
  layers: FlatLayer[];
  totalHeight: number;
}

export class FlatPresetParseError extends Error {}

function readLayer(v: unknown): FlatLayer {
  if (typeof v !== 'object' || v === null) return { block: '', height: 0 };
  const o = v as Record<string, unknown>;
  const rawBlock = typeof o['block'] === 'string' ? o['block'] : '';
  return {
    block: rawBlock ? mapVanillaName(rawBlock) : '',
    height: typeof o['height'] === 'number' ? Math.max(0, Math.trunc(o['height'])) : 0,
  };
}

export function parseVanillaFlatPreset(text: string): ParsedFlatPreset {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new FlatPresetParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new FlatPresetParseError('flat_preset must be an object');
  const o = json as Record<string, unknown>;
  const layers: FlatLayer[] = [];
  if (Array.isArray(o['layers'])) for (const l of o['layers']) layers.push(readLayer(l));
  const overrides: string[] = [];
  if (Array.isArray(o['structure_overrides'])) {
    for (const s of o['structure_overrides']) {
      if (typeof s === 'string') overrides.push(s.replace(/^minecraft:/, ''));
    }
  }
  const biomeRaw = typeof o['biome'] === 'string' ? o['biome'] : 'plains';
  return {
    biome: biomeRaw.replace(/^minecraft:/, ''),
    lakes: o['lakes'] === true,
    features: o['features'] === true,
    structureOverrides: overrides,
    layers,
    totalHeight: layers.reduce((s, l) => s + l.height, 0),
  };
}
