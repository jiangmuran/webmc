export interface BiomeClimate {
  temperature: number;
  humidity: number;
}

const GRASS_COLORMAP_256 = (t: number, h: number): number => {
  const r = Math.floor(120 + (1 - t) * 80);
  const g = Math.floor(180 + h * 40);
  const b = Math.floor(60 + t * 40);
  return (r << 16) | (g << 8) | b;
};

export function grassColor(climate: BiomeClimate): number {
  const t = Math.max(0, Math.min(1, climate.temperature));
  const h = Math.max(0, Math.min(1, climate.humidity));
  return GRASS_COLORMAP_256(t, h);
}

export function foliageColor(climate: BiomeClimate): number {
  const t = Math.max(0, Math.min(1, climate.temperature));
  const h = Math.max(0, Math.min(1, climate.humidity));
  const r = Math.floor(80 + (1 - t) * 80);
  const g = Math.floor(160 + h * 50);
  const b = Math.floor(40 + t * 40);
  return (r << 16) | (g << 8) | b;
}

export function waterTintForBiome(biome: string): number {
  if (biome === 'warm_ocean') return 0x4ecfed;
  if (biome === 'cold_ocean') return 0x3938c9;
  if (biome === 'frozen_ocean') return 0x3938c9;
  if (biome === 'swamp') return 0x617b64;
  return 0x3f76e4;
}
