// Biome temperature + humidity table. Temperature determines:
//   - whether water freezes into ice (T ≤ 0.15)
//   - whether rain falls as snow vs rain (T ≤ 0.15 → snow)
//   - whether rain occurs at all (T ≥ 2 → dry / desert)
// Humidity gates fire spread rate.

export interface BiomeClimate {
  temperature: number; // -0.5 .. 2
  humidity: number; // 0 .. 1
}

export const CLIMATE_BY_BIOME: Record<string, BiomeClimate> = {
  plains: { temperature: 0.8, humidity: 0.4 },
  forest: { temperature: 0.7, humidity: 0.8 },
  birch_forest: { temperature: 0.6, humidity: 0.6 },
  dark_forest: { temperature: 0.7, humidity: 0.8 },
  taiga: { temperature: 0.25, humidity: 0.8 },
  snowy_taiga: { temperature: -0.5, humidity: 0.4 },
  snowy_plains: { temperature: 0.0, humidity: 0.5 },
  desert: { temperature: 2.0, humidity: 0.0 },
  savanna: { temperature: 1.2, humidity: 0.0 },
  savanna_plateau: { temperature: 1.0, humidity: 0.0 },
  jungle: { temperature: 0.95, humidity: 0.9 },
  bamboo_jungle: { temperature: 0.95, humidity: 0.9 },
  swamp: { temperature: 0.8, humidity: 0.9 },
  mangrove_swamp: { temperature: 0.8, humidity: 0.9 },
  ocean: { temperature: 0.5, humidity: 0.5 },
  warm_ocean: { temperature: 0.5, humidity: 0.5 },
  cold_ocean: { temperature: 0.5, humidity: 0.5 },
  frozen_ocean: { temperature: 0.0, humidity: 0.5 },
  mushroom_fields: { temperature: 0.9, humidity: 1.0 },
  badlands: { temperature: 2.0, humidity: 0.0 },
  nether_wastes: { temperature: 2.0, humidity: 0.0 },
  the_end: { temperature: 0.5, humidity: 0.5 },
  pale_garden: { temperature: 0.7, humidity: 0.8 },
  cherry_grove: { temperature: 0.5, humidity: 0.8 },
};

export function climateOf(biome: string): BiomeClimate {
  return CLIMATE_BY_BIOME[biome] ?? { temperature: 0.8, humidity: 0.4 };
}

export function canSnow(biome: string): boolean {
  return climateOf(biome).temperature <= 0.15;
}

export function canRain(biome: string): boolean {
  const t = climateOf(biome).temperature;
  return t > 0.15 && t < 2.0;
}

export function isDry(biome: string): boolean {
  return climateOf(biome).temperature >= 2.0;
}

// Wiki (minecraft.wiki/w/Biome#Temperature): temperature decreases by
// 0.00125 per block above y=81. Old constant 0.0005 was less than half
// the wiki rate, so peaks stayed too warm to ever snow on warm biomes.
export const TEMP_FALLOFF_PER_BLOCK = 0.00125;
export const TEMP_ALTITUDE_REF_Y = 81;

export function temperatureAt(biome: string, y: number): number {
  const base = climateOf(biome).temperature;
  if (y <= TEMP_ALTITUDE_REF_Y) return base;
  return base - (y - TEMP_ALTITUDE_REF_Y) * TEMP_FALLOFF_PER_BLOCK;
}

export function canSnowAt(biome: string, y: number): boolean {
  return temperatureAt(biome, y) <= 0.15;
}
