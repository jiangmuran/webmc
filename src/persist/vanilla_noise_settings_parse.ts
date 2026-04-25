// Parse a vanilla worldgen noise_settings JSON. Defines how the noise-
// based chunk generator builds terrain. Schema is large; we extract the
// fields most useful for previewing what dimension settings ship.
//
//   {
//     "sea_level": 63,
//     "disable_mob_generation": false,
//     "aquifers_enabled": true,
//     "ore_veins_enabled": true,
//     "legacy_random_source": false,
//     "default_block": { "Name": "minecraft:stone" },
//     "default_fluid": { "Name": "minecraft:water" },
//     "noise": { "min_y": -64, "height": 384, "size_horizontal": 1, "size_vertical": 2 },
//     "spawn_target": [ ... ]
//   }
//
// Source: minecraft.wiki "Noise settings". Behavioral spec — clean-room.

import { mapVanillaName } from './vanilla_block_map';

export interface NoiseShape {
  minY: number;
  height: number;
  sizeHorizontal: number;
  sizeVertical: number;
}

export interface ParsedNoiseSettings {
  seaLevel: number;
  disableMobGeneration: boolean;
  aquifersEnabled: boolean;
  oreVeinsEnabled: boolean;
  legacyRandomSource: boolean;
  defaultBlock: string; // webmc-namespaced block name
  defaultFluid: string; // webmc-namespaced block name
  noise: NoiseShape;
}

export class NoiseSettingsParseError extends Error {}

function readBlockName(v: unknown): string {
  if (typeof v === 'string') return mapVanillaName(v);
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    const n = typeof o['Name'] === 'string' ? o['Name'] : '';
    return n ? mapVanillaName(n) : '';
  }
  return '';
}

function readNoiseShape(v: unknown): NoiseShape {
  const def: NoiseShape = { minY: 0, height: 256, sizeHorizontal: 1, sizeVertical: 1 };
  if (typeof v !== 'object' || v === null) return def;
  const o = v as Record<string, unknown>;
  return {
    minY: typeof o['min_y'] === 'number' ? Math.trunc(o['min_y']) : def.minY,
    height: typeof o['height'] === 'number' ? Math.trunc(o['height']) : def.height,
    sizeHorizontal:
      typeof o['size_horizontal'] === 'number'
        ? Math.trunc(o['size_horizontal'])
        : def.sizeHorizontal,
    sizeVertical:
      typeof o['size_vertical'] === 'number' ? Math.trunc(o['size_vertical']) : def.sizeVertical,
  };
}

export function parseVanillaNoiseSettings(text: string): ParsedNoiseSettings {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new NoiseSettingsParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new NoiseSettingsParseError('noise_settings must be an object');
  const o = json as Record<string, unknown>;
  return {
    seaLevel: typeof o['sea_level'] === 'number' ? Math.trunc(o['sea_level']) : 63,
    disableMobGeneration: o['disable_mob_generation'] === true,
    aquifersEnabled: o['aquifers_enabled'] !== false,
    oreVeinsEnabled: o['ore_veins_enabled'] !== false,
    legacyRandomSource: o['legacy_random_source'] === true,
    defaultBlock: readBlockName(o['default_block']),
    defaultFluid: readBlockName(o['default_fluid']),
    noise: readNoiseShape(o['noise']),
  };
}
