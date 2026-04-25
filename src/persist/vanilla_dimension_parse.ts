// Parse a vanilla dimension JSON. Schema (subset):
//   {
//     "type": "minecraft:overworld",
//     "generator": {
//       "type": "minecraft:noise" | "minecraft:flat" | "minecraft:debug",
//       "settings": "minecraft:overworld",
//       "biome_source": { "type": "minecraft:fixed" | ... }
//     }
//   }
//
// We strip the minecraft: namespace and emit webmc-prefixed type ids
// where it makes sense for downstream registration.
//
// Source: minecraft.wiki "Custom dimension". Behavioral spec — clean-room.

export type GeneratorKind = 'noise' | 'flat' | 'debug' | 'unknown';

export interface ParsedDimension {
  // The dimension type id ("overworld", "the_nether", "the_end", ...).
  typeId: string;
  generator: {
    kind: GeneratorKind;
    // Settings preset id ("overworld", "amplified", "caves", "nether", "end", custom).
    // Empty string when the generator (e.g. flat) carries inline layers instead.
    settingsId: string;
    biomeSourceKind: string; // 'fixed' | 'multi_noise' | 'checkerboard' | 'the_end' | ...
    biomeSourcePreset: string | null;
  };
}

export class DimensionParseError extends Error {}

function stripNamespace(s: string): string {
  return s.replace(/^minecraft:/, '');
}

function asGeneratorKind(s: string): GeneratorKind {
  const x = stripNamespace(s);
  if (x === 'noise' || x === 'flat' || x === 'debug') return x;
  return 'unknown';
}

export function parseVanillaDimension(text: string): ParsedDimension {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new DimensionParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new DimensionParseError('dimension must be an object');
  const obj = json as Record<string, unknown>;
  const typeId = stripNamespace(typeof obj['type'] === 'string' ? obj['type'] : 'overworld');
  const genRaw = obj['generator'];
  let kind: GeneratorKind = 'unknown';
  let settingsId = '';
  let biomeSourceKind = '';
  let biomeSourcePreset: string | null = null;
  if (typeof genRaw === 'object' && genRaw !== null) {
    const g = genRaw as Record<string, unknown>;
    if (typeof g['type'] === 'string') kind = asGeneratorKind(g['type']);
    if (typeof g['settings'] === 'string') settingsId = stripNamespace(g['settings']);
    const bs = g['biome_source'];
    if (typeof bs === 'object' && bs !== null) {
      const bo = bs as Record<string, unknown>;
      if (typeof bo['type'] === 'string') biomeSourceKind = stripNamespace(bo['type']);
      if (typeof bo['preset'] === 'string') biomeSourcePreset = stripNamespace(bo['preset']);
    }
  }
  return { typeId, generator: { kind, settingsId, biomeSourceKind, biomeSourcePreset } };
}
