// Parse a vanilla worldgen multi_noise_biome_source_parameter_list JSON.
// This is the file used by 1.18+ overworld biome layout. Schema:
//   {
//     "preset": "minecraft:overworld" | { "biomes": [
//       { "biome": "minecraft:plains",
//         "parameters": { "temperature": 0.4, "humidity": 0.0, ... } } ]}
//   }
//
// Source: minecraft.wiki "Biome source". Behavioral spec — clean-room.

export interface MultiNoiseBiomeEntry {
  biome: string; // mapped to webmc namespace
  // Raw parameters object kept verbatim — the schema is large + version-dependent.
  parameters: Record<string, unknown>;
}

export interface ParsedMultiNoiseBiomeSource {
  // If the file references a built-in preset, this is its bare id (e.g. 'overworld').
  presetId: string | null;
  // Otherwise the inline biome list.
  biomes: MultiNoiseBiomeEntry[];
}

export class MultiNoiseParseError extends Error {}

function readBiomes(v: unknown): MultiNoiseBiomeEntry[] {
  if (!Array.isArray(v)) return [];
  const out: MultiNoiseBiomeEntry[] = [];
  for (const e of v) {
    if (typeof e !== 'object' || e === null) continue;
    const o = e as Record<string, unknown>;
    const biome = typeof o['biome'] === 'string' ? o['biome'] : '';
    if (!biome) continue;
    const params =
      typeof o['parameters'] === 'object' && o['parameters'] !== null
        ? (o['parameters'] as Record<string, unknown>)
        : {};
    out.push({
      biome: `webmc:${biome.replace(/^minecraft:/, '')}`,
      parameters: params,
    });
  }
  return out;
}

export function parseVanillaMultiNoise(text: string): ParsedMultiNoiseBiomeSource {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new MultiNoiseParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new MultiNoiseParseError('multi_noise must be an object');
  const o = json as Record<string, unknown>;
  if (typeof o['preset'] === 'string') {
    return {
      presetId: o['preset'].replace(/^minecraft:/, ''),
      biomes: [],
    };
  }
  if (typeof o['preset'] === 'object' && o['preset'] !== null) {
    const preset = o['preset'] as Record<string, unknown>;
    return { presetId: null, biomes: readBiomes(preset['biomes']) };
  }
  return { presetId: null, biomes: readBiomes(o['biomes']) };
}
