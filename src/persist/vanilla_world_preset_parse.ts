// Parse a vanilla world_preset JSON. World presets bundle a set of
// dimension definitions for the create-world UI. Schema:
//   { "dimensions": {
//       "minecraft:overworld": { "type": "...", "generator": {...} },
//       "minecraft:the_nether": { ... },
//       "minecraft:the_end":    { ... }
//     }
//   }
//
// Source: minecraft.wiki "World preset". Behavioral spec — clean-room.

import { parseVanillaDimension, type ParsedDimension } from './vanilla_dimension_parse';

export interface ParsedWorldPreset {
  dimensions: Record<string, ParsedDimension>;
}

export class WorldPresetParseError extends Error {}

export function parseVanillaWorldPreset(text: string): ParsedWorldPreset {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new WorldPresetParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new WorldPresetParseError('world_preset must be an object');
  const o = json as Record<string, unknown>;
  const dimensions: Record<string, ParsedDimension> = {};
  const raw = o['dimensions'];
  if (typeof raw === 'object' && raw !== null) {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      const id = k.replace(/^minecraft:/, '');
      // parseVanillaDimension takes JSON text; round-trip via stringify
      // so it gets the same object shape, then attach to the bundle.
      try {
        dimensions[id] = parseVanillaDimension(JSON.stringify(v));
      } catch {
        // Skip malformed dimension entries; preset should still resolve.
      }
    }
  }
  return { dimensions };
}
