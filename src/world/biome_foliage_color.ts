// Biome-tinted foliage + grass colors. MC uses two PNG ramps (foliage.png,
// grass.png) indexed by (temperature, humidity); we store a subset of
// per-biome pre-baked RGBs keyed by biome id, since we're not bundling
// Mojang's ramp.

export type RGB = readonly [number, number, number];

export interface FoliageColors {
  grass: RGB;
  foliage: RGB;
}

const DEFAULT: FoliageColors = { grass: [0x79, 0xc0, 0x5a], foliage: [0x59, 0xae, 0x30] };

const TABLE: Record<string, FoliageColors> = {
  plains: { grass: [0x91, 0xbd, 0x59], foliage: [0x77, 0xab, 0x2f] },
  forest: { grass: [0x79, 0xc0, 0x5a], foliage: [0x59, 0xae, 0x30] },
  birch_forest: { grass: [0x88, 0xbb, 0x67], foliage: [0x6b, 0xa9, 0x41] },
  dark_forest: { grass: [0x50, 0x7a, 0x32], foliage: [0x50, 0x7a, 0x32] },
  taiga: { grass: [0x86, 0xb7, 0x83], foliage: [0x68, 0xa4, 0x64] },
  snowy_taiga: { grass: [0x60, 0xa1, 0x7b], foliage: [0x60, 0xa1, 0x7b] },
  snowy_plains: { grass: [0x80, 0xb4, 0x97], foliage: [0x60, 0xa1, 0x7b] },
  desert: { grass: [0xbf, 0xb7, 0x55], foliage: [0xae, 0xa4, 0x2a] },
  savanna: { grass: [0xbf, 0xb7, 0x55], foliage: [0xae, 0xa4, 0x2a] },
  jungle: { grass: [0x59, 0xc9, 0x3c], foliage: [0x30, 0xbb, 0x0b] },
  bamboo_jungle: { grass: [0x59, 0xc9, 0x3c], foliage: [0x30, 0xbb, 0x0b] },
  swamp: { grass: [0x6a, 0x70, 0x39], foliage: [0x6a, 0x70, 0x39] },
  mangrove_swamp: { grass: [0x6a, 0x70, 0x39], foliage: [0x8d, 0xb3, 0x60] },
  badlands: { grass: [0x90, 0x81, 0x4d], foliage: [0x9e, 0x81, 0x4d] },
  ocean: DEFAULT,
  mushroom_fields: { grass: [0x55, 0xc9, 0x3f], foliage: [0x2b, 0xbb, 0x0f] },
  cherry_grove: { grass: [0xb6, 0xdb, 0x61], foliage: [0xb6, 0xdb, 0x61] },
  pale_garden: { grass: [0x77, 0x8d, 0x6f], foliage: [0x77, 0x8d, 0x6f] },
};

export function foliageOf(biome: string): FoliageColors {
  return TABLE[biome] ?? DEFAULT;
}

// Blend N biomes by weight.
export function blendFoliage(samples: readonly { biome: string; weight: number }[]): FoliageColors {
  let total = 0;
  for (const s of samples) total += s.weight;
  if (total <= 0) return DEFAULT;
  let gr = 0,
    gg = 0,
    gb = 0,
    fr = 0,
    fg = 0,
    fb = 0;
  for (const s of samples) {
    const w = s.weight / total;
    const f = foliageOf(s.biome);
    gr += f.grass[0] * w;
    gg += f.grass[1] * w;
    gb += f.grass[2] * w;
    fr += f.foliage[0] * w;
    fg += f.foliage[1] * w;
    fb += f.foliage[2] * w;
  }
  return {
    grass: [Math.round(gr), Math.round(gg), Math.round(gb)],
    foliage: [Math.round(fr), Math.round(fg), Math.round(fb)],
  };
}
