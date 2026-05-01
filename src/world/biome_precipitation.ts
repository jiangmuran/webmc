// Biome precipitation. Cold biomes snow at the surface; temperate rain;
// desert/jungle/savanna extremes have their own rules.
//
// Wiki (minecraft.wiki/w/Biome): "Locations with Y≤80 use the base
// temperature as actual temperature. ... at Y≥81 the actual temperature
// decreases by 0.00125 (1/800) every block up."
//
// Old constants used 0.00166 per block above Y=64 — the falloff rate
// was 33% too fast and started 17 blocks below the wiki's threshold.
// A plains biome (base 0.8) at Y=128 read as 0.69 in the old formula
// (so snow possible at high mountains earlier than canon) but should
// be 0.741 per wiki — only 1/4 of the way to the snow threshold.
// Sibling biome_temperature.ts already uses 0.00125 / Y≥81.

export type PrecipKind = 'none' | 'rain' | 'snow';

export interface BiomeInfo {
  baseTemperature: number;
  hasPrecipitation: boolean;
}

export const TEMP_FALLOFF_PER_BLOCK = 0.00125;
export const TEMP_ALTITUDE_REF_Y = 81;

export function adjustedTemperature(b: BiomeInfo, y: number): number {
  if (y < TEMP_ALTITUDE_REF_Y) return b.baseTemperature;
  return b.baseTemperature - (y - TEMP_ALTITUDE_REF_Y) * TEMP_FALLOFF_PER_BLOCK;
}

export function precipitationAt(b: BiomeInfo, y: number): PrecipKind {
  if (!b.hasPrecipitation) return 'none';
  const t = adjustedTemperature(b, y);
  if (t < 0.15) return 'snow';
  return 'rain';
}

// Snow-layer accumulation: only if temp < 0.15 and block above is exposed
// to sky and air currently.
export function canAccumulateSnow(b: BiomeInfo, y: number, skyExposed: boolean): boolean {
  if (!b.hasPrecipitation) return false;
  if (!skyExposed) return false;
  return adjustedTemperature(b, y) < 0.15;
}
