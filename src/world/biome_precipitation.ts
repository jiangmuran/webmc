// Biome precipitation. Cold biomes snow at the surface; temperate rain;
// desert/jungle/savanna extremes have their own rules. Temperature also
// drops 0.00166 per block above Y=64.

export type PrecipKind = 'none' | 'rain' | 'snow';

export interface BiomeInfo {
  baseTemperature: number;
  hasPrecipitation: boolean;
}

export function adjustedTemperature(b: BiomeInfo, y: number): number {
  if (y <= 64) return b.baseTemperature;
  return b.baseTemperature - (y - 64) * 0.00166;
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
