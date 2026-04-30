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

// Wiki (minecraft.wiki/w/Color#Water): canonical water tints by biome:
//   default       0x3F76E4
//   swamp         0x617B64
//   warm_ocean    0x43D5EE
//   lukewarm_ocean 0x45ADF2
//   cold_ocean    0x3D57D6
//   frozen_ocean  0x3938C9
// Old code used 0x3938C9 for BOTH cold_ocean and frozen_ocean (cold
// ocean rendered as frozen ocean's deep navy instead of its lighter
// blue), and an off-by-a-few-bytes warm_ocean. Lukewarm_ocean was
// missing entirely.
export function waterTintForBiome(biome: string): number {
  if (biome === 'warm_ocean') return 0x43d5ee;
  if (biome === 'lukewarm_ocean') return 0x45adf2;
  if (biome === 'cold_ocean') return 0x3d57d6;
  if (biome === 'frozen_ocean') return 0x3938c9;
  if (biome === 'frozen_river') return 0x3938c9;
  if (biome === 'swamp') return 0x617b64;
  return 0x3f76e4;
}
