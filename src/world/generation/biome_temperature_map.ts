export type Biome =
  | 'plains'
  | 'desert'
  | 'forest'
  | 'taiga'
  | 'snowy_plains'
  | 'swamp'
  | 'ocean'
  | 'jungle'
  | 'savanna'
  | 'badlands'
  | 'mushroom_fields'
  | 'frozen_ocean';

const TEMPERATURE: Record<Biome, number> = {
  plains: 0.8,
  desert: 2.0,
  forest: 0.7,
  taiga: 0.25,
  snowy_plains: 0.0,
  swamp: 0.8,
  ocean: 0.5,
  jungle: 0.95,
  savanna: 2.0,
  badlands: 2.0,
  mushroom_fields: 0.9,
  frozen_ocean: 0.0,
};

export function biomeTemperature(b: Biome): number {
  return TEMPERATURE[b];
}

// Wiki (minecraft.wiki/w/Biome#Climate): "Snow falls when biome
// temperature is below 0.15. Rain falls when temperature is
// between 0.15 (inclusive) and 0.95 (inclusive). Biomes with
// temperature above 0.95 have no precipitation."
//
// Old `rainsInBiome` upper bound was 1.5 — way too permissive,
// allowed rain in 0.95-1.5 range that wiki says is dry. Old
// `dryInBiome` threshold was 1.5; wiki's threshold is 0.95.
export function snowsInBiome(b: Biome): boolean {
  return biomeTemperature(b) < 0.15;
}

export function rainsInBiome(b: Biome): boolean {
  const t = biomeTemperature(b);
  return t >= 0.15 && t <= 0.95;
}

export function dryInBiome(b: Biome): boolean {
  return biomeTemperature(b) > 0.95;
}
