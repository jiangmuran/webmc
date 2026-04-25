// Parse a vanilla biome JSON (1.18+ datapack format). Schema (subset):
//   {
//     "temperature": <float>,
//     "downfall": <float>,
//     "has_precipitation": <bool>,
//     "effects": { "fog_color": <int>, "water_color": <int>, "sky_color": <int>, ... },
//     "spawners": { "monster": [{ "type": "minecraft:zombie", "weight": 95 }, ...], ... }
//   }
//
// Source: minecraft.wiki "Biome". Behavioral spec — clean-room.

export interface BiomeEffects {
  fogColor: number;
  waterColor: number;
  waterFogColor: number;
  skyColor: number;
  foliageColor: number | null;
  grassColor: number | null;
}

export interface BiomeSpawnerEntry {
  type: string; // mapped to webmc namespace
  weight: number;
  minCount: number;
  maxCount: number;
}

export type BiomeSpawnerCategory =
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'water_creature'
  | 'water_ambient'
  | 'underground_water_creature'
  | 'misc';

export interface ParsedBiome {
  temperature: number;
  downfall: number;
  hasPrecipitation: boolean;
  effects: BiomeEffects;
  spawners: Partial<Record<BiomeSpawnerCategory, BiomeSpawnerEntry[]>>;
}

export class BiomeParseError extends Error {}

const SPAWNER_CATEGORIES: BiomeSpawnerCategory[] = [
  'monster',
  'creature',
  'ambient',
  'water_creature',
  'water_ambient',
  'underground_water_creature',
  'misc',
];

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function readEffects(raw: unknown): BiomeEffects {
  const out: BiomeEffects = {
    fogColor: 0xc0d8ff,
    waterColor: 0x3f76e4,
    waterFogColor: 0x050533,
    skyColor: 0x78a7ff,
    foliageColor: null,
    grassColor: null,
  };
  if (typeof raw !== 'object' || raw === null) return out;
  const e = raw as Record<string, unknown>;
  out.fogColor = num(e['fog_color'], out.fogColor);
  out.waterColor = num(e['water_color'], out.waterColor);
  out.waterFogColor = num(e['water_fog_color'], out.waterFogColor);
  out.skyColor = num(e['sky_color'], out.skyColor);
  if (typeof e['foliage_color'] === 'number') out.foliageColor = e['foliage_color'];
  if (typeof e['grass_color'] === 'number') out.grassColor = e['grass_color'];
  return out;
}

function readSpawnerList(raw: unknown): BiomeSpawnerEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: BiomeSpawnerEntry[] = [];
  for (const e of raw) {
    if (typeof e !== 'object' || e === null) continue;
    const eo = e as Record<string, unknown>;
    const type = typeof eo['type'] === 'string' ? eo['type'] : '';
    if (!type) continue;
    out.push({
      type: `webmc:${type.replace(/^minecraft:/, '')}`,
      weight: num(eo['weight'], 1),
      minCount: num(eo['minCount'] ?? eo['min_count'], 1),
      maxCount: num(eo['maxCount'] ?? eo['max_count'], 1),
    });
  }
  return out;
}

export function parseVanillaBiome(text: string): ParsedBiome {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new BiomeParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new BiomeParseError('biome must be an object');
  const obj = json as Record<string, unknown>;
  const spawners: Partial<Record<BiomeSpawnerCategory, BiomeSpawnerEntry[]>> = {};
  if (typeof obj['spawners'] === 'object' && obj['spawners'] !== null) {
    const sp = obj['spawners'] as Record<string, unknown>;
    for (const cat of SPAWNER_CATEGORIES) {
      const list = readSpawnerList(sp[cat]);
      if (list.length > 0) spawners[cat] = list;
    }
  }
  return {
    temperature: num(obj['temperature'], 0.5),
    downfall: num(obj['downfall'], 0.5),
    hasPrecipitation:
      obj['has_precipitation'] === true ||
      (obj['has_precipitation'] === undefined && obj['precipitation'] !== 'none'),
    effects: readEffects(obj['effects']),
    spawners,
  };
}
