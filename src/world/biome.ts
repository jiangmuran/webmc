// Biome registry — 15 biomes with the params the mesher / generator /
// renderer need. Temperature + humidity drive foliage tint; surface /
// sub-surface / top blocks come out of this table at generate time.

export type BiomeName =
  | 'plains'
  | 'forest'
  | 'desert'
  | 'taiga'
  | 'snowy_plains'
  | 'jungle'
  | 'swamp'
  | 'savanna'
  | 'mountain'
  | 'beach'
  | 'ocean'
  | 'river'
  | 'badlands'
  | 'mushroom_fields'
  | 'cherry_grove';

export interface BiomeDef {
  name: BiomeName;
  temperature: number; // -0.5 (snowy) .. 2 (desert)
  humidity: number; // 0 .. 1
  surfaceBlock: string;
  subsurfaceBlock: string;
  topBlock: string;
  fogColor: readonly [number, number, number];
  grassColor: readonly [number, number, number];
  foliageColor: readonly [number, number, number];
  waterColor: readonly [number, number, number];
  hasTrees: boolean;
  hasSnow: boolean;
  treeDensity: number;
}

function d(
  name: BiomeName,
  temp: number,
  hum: number,
  surface: string,
  subsurface: string,
  top: string,
  fog: readonly [number, number, number],
  grass: readonly [number, number, number],
  foliage: readonly [number, number, number],
  water: readonly [number, number, number],
  opts: Partial<Pick<BiomeDef, 'hasTrees' | 'hasSnow' | 'treeDensity'>> = {},
): BiomeDef {
  return {
    name,
    temperature: temp,
    humidity: hum,
    surfaceBlock: surface,
    subsurfaceBlock: subsurface,
    topBlock: top,
    fogColor: fog,
    grassColor: grass,
    foliageColor: foliage,
    waterColor: water,
    hasTrees: opts.hasTrees ?? false,
    hasSnow: opts.hasSnow ?? false,
    treeDensity: opts.treeDensity ?? 0,
  };
}

export const BIOMES: Record<BiomeName, BiomeDef> = {
  plains: d(
    'plains',
    0.8,
    0.4,
    'webmc:dirt',
    'webmc:dirt',
    'webmc:grass_block',
    [198, 221, 255],
    [140, 185, 78],
    [119, 171, 47],
    [63, 118, 228],
    { hasTrees: true, treeDensity: 0.005 },
  ),
  forest: d(
    'forest',
    0.7,
    0.8,
    'webmc:dirt',
    'webmc:dirt',
    'webmc:grass_block',
    [198, 221, 255],
    [101, 171, 36],
    [72, 156, 42],
    [63, 118, 228],
    { hasTrees: true, treeDensity: 0.06 },
  ),
  desert: d(
    'desert',
    2,
    0,
    'webmc:sand',
    'webmc:sand',
    'webmc:sand',
    [249, 230, 173],
    [189, 178, 95],
    [174, 164, 42],
    [50, 168, 180],
  ),
  taiga: d(
    'taiga',
    0.25,
    0.8,
    'webmc:dirt',
    'webmc:dirt',
    'webmc:grass_block',
    [198, 221, 255],
    [130, 168, 80],
    [104, 163, 40],
    [67, 124, 193],
    { hasTrees: true, treeDensity: 0.08 },
  ),
  snowy_plains: d(
    'snowy_plains',
    -0.5,
    0.5,
    'webmc:snow_block',
    'webmc:dirt',
    'webmc:snow_block',
    [245, 245, 255],
    [140, 185, 150],
    [110, 170, 120],
    [57, 88, 175],
    { hasSnow: true },
  ),
  jungle: d(
    'jungle',
    1.2,
    0.9,
    'webmc:dirt',
    'webmc:dirt',
    'webmc:grass_block',
    [111, 168, 102],
    [51, 190, 22],
    [30, 155, 18],
    [20, 165, 185],
    { hasTrees: true, treeDensity: 0.15 },
  ),
  swamp: d(
    'swamp',
    0.8,
    0.9,
    'webmc:mud',
    'webmc:mud',
    'webmc:grass_block',
    [109, 108, 70],
    [106, 112, 57],
    [107, 112, 57],
    [98, 122, 112],
    { hasTrees: true, treeDensity: 0.03 },
  ),
  savanna: d(
    'savanna',
    1.2,
    0,
    'webmc:dirt',
    'webmc:dirt',
    'webmc:grass_block',
    [198, 221, 255],
    [189, 178, 95],
    [174, 164, 42],
    [63, 118, 228],
    { hasTrees: true, treeDensity: 0.01 },
  ),
  mountain: d(
    'mountain',
    0.2,
    0.3,
    'webmc:stone',
    'webmc:stone',
    'webmc:stone',
    [198, 221, 255],
    [140, 185, 78],
    [119, 171, 47],
    [63, 118, 228],
  ),
  beach: d(
    'beach',
    0.8,
    0.4,
    'webmc:sand',
    'webmc:sand',
    'webmc:sand',
    [198, 221, 255],
    [140, 185, 78],
    [119, 171, 47],
    [63, 118, 228],
  ),
  ocean: d(
    'ocean',
    0.5,
    0.5,
    'webmc:sand',
    'webmc:dirt',
    'webmc:water',
    [198, 221, 255],
    [140, 185, 78],
    [119, 171, 47],
    [63, 118, 228],
  ),
  river: d(
    'river',
    0.5,
    0.5,
    'webmc:sand',
    'webmc:dirt',
    'webmc:water',
    [198, 221, 255],
    [140, 185, 78],
    [119, 171, 47],
    [63, 118, 228],
  ),
  badlands: d(
    'badlands',
    2,
    0,
    'webmc:sand',
    'webmc:sand',
    'webmc:sand',
    [212, 148, 60],
    [144, 129, 77],
    [158, 129, 77],
    [74, 118, 166],
  ),
  mushroom_fields: d(
    'mushroom_fields',
    0.9,
    1,
    'webmc:mycelium_stub',
    'webmc:dirt',
    'webmc:grass_block',
    [198, 221, 255],
    [85, 183, 151],
    [45, 150, 110],
    [63, 118, 228],
  ),
  cherry_grove: d(
    'cherry_grove',
    0.5,
    0.8,
    'webmc:dirt',
    'webmc:dirt',
    'webmc:grass_block',
    [245, 200, 215],
    [125, 165, 90],
    [235, 180, 205],
    [60, 135, 215],
    { hasTrees: true, treeDensity: 0.04 },
  ),
};

// Pick a biome for (temperature, humidity) using nearest-point metric. Used
// by generators that have their own temperature/humidity noise passes; maps
// climate to a named biome without a big if/else.
export function pickBiome(temperature: number, humidity: number): BiomeName {
  let bestName: BiomeName = 'plains';
  let bestDist = Infinity;
  for (const name of Object.keys(BIOMES) as BiomeName[]) {
    const b = BIOMES[name];
    const dt = temperature - b.temperature;
    const dh = humidity - b.humidity;
    const dist = dt * dt + dh * dh;
    if (dist < bestDist) {
      bestDist = dist;
      bestName = name;
    }
  }
  return bestName;
}
