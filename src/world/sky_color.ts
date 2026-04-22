// Per-biome sky and fog color. Each biome has a base sky color (top of the
// sky gradient) and a fog color (blended with distance fog). Blend between
// biomes happens in the renderer; this module exposes the per-biome data
// and a helper for lerping two colors by a weight.

export type RGB = readonly [number, number, number];

export interface SkyPalette {
  sky: RGB;
  fog: RGB;
  water: RGB;
}

// Taken from MC-equivalent defaults per biome family.
export const SKY_BY_BIOME: Record<string, SkyPalette> = {
  plains: { sky: [0x78, 0xa7, 0xff], fog: [0xc0, 0xd8, 0xff], water: [0x3f, 0x76, 0xe4] },
  forest: { sky: [0x78, 0xa7, 0xff], fog: [0xc0, 0xd8, 0xff], water: [0x3f, 0x76, 0xe4] },
  desert: { sky: [0x78, 0xa7, 0xff], fog: [0xff, 0xc8, 0x7a], water: [0x32, 0xa5, 0x98] },
  savanna: { sky: [0x78, 0xa7, 0xff], fog: [0xbf, 0xb7, 0x55], water: [0x2c, 0x8b, 0x9c] },
  ocean: { sky: [0x78, 0xa7, 0xff], fog: [0xc0, 0xd8, 0xff], water: [0x1c, 0x54, 0xab] },
  warm_ocean: { sky: [0x78, 0xa7, 0xff], fog: [0xc0, 0xd8, 0xff], water: [0x43, 0xd5, 0xee] },
  cold_ocean: { sky: [0x78, 0xa7, 0xff], fog: [0xc0, 0xd8, 0xff], water: [0x20, 0x70, 0x93] },
  frozen_ocean: { sky: [0x8f, 0x9a, 0xa5], fog: [0xe0, 0xee, 0xff], water: [0x39, 0x38, 0xc9] },
  snowy: { sky: [0x8f, 0x9a, 0xa5], fog: [0xe0, 0xee, 0xff], water: [0x3d, 0x57, 0xd6] },
  taiga: { sky: [0x8f, 0xa5, 0xaf], fog: [0xc0, 0xd8, 0xff], water: [0x28, 0x7d, 0xac] },
  jungle: { sky: [0x77, 0xa7, 0xff], fog: [0x9f, 0xbb, 0x3b], water: [0x14, 0xa0, 0xbf] },
  swamp: { sky: [0x78, 0xa7, 0xff], fog: [0x6a, 0x70, 0x39], water: [0x61, 0x7b, 0x64] },
  nether_wastes: { sky: [0x30, 0x04, 0x04], fog: [0x33, 0x0c, 0x07], water: [0x90, 0x52, 0x27] },
  soul_sand_valley: { sky: [0x1b, 0x4a, 0x4a], fog: [0x1b, 0x4a, 0x4a], water: [0x90, 0x52, 0x27] },
  warped_forest: { sky: [0x1a, 0x05, 0x15], fog: [0x1a, 0x05, 0x15], water: [0x3f, 0x76, 0xe4] },
  crimson_forest: { sky: [0x33, 0x0c, 0x07], fog: [0x33, 0x0c, 0x07], water: [0x3f, 0x76, 0xe4] },
  the_end: { sky: [0x00, 0x00, 0x00], fog: [0x22, 0x1e, 0x2f], water: [0x3f, 0x76, 0xe4] },
  pale_garden: { sky: [0x7c, 0x8a, 0x9e], fog: [0xbd, 0xc1, 0xc9], water: [0x76, 0x9a, 0xa3] },
};

const PLAINS: SkyPalette = {
  sky: [0x78, 0xa7, 0xff],
  fog: [0xc0, 0xd8, 0xff],
  water: [0x3f, 0x76, 0xe4],
};

export function skyOf(biome: string): SkyPalette {
  return SKY_BY_BIOME[biome] ?? PLAINS;
}

export function lerpColor(a: RGB, b: RGB, t: number): RGB {
  const c = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * c),
    Math.round(a[1] + (b[1] - a[1]) * c),
    Math.round(a[2] + (b[2] - a[2]) * c),
  ];
}

// Blend N biomes by weight. Weights are normalized automatically.
export function blendSky(samples: readonly { biome: string; weight: number }[]): SkyPalette {
  let totalWeight = 0;
  for (const s of samples) totalWeight += s.weight;
  if (totalWeight <= 0) return skyOf('plains');
  const acc: [number, number, number, number, number, number, number, number, number] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  for (const s of samples) {
    const w = s.weight / totalWeight;
    const p = skyOf(s.biome);
    acc[0] += p.sky[0] * w;
    acc[1] += p.sky[1] * w;
    acc[2] += p.sky[2] * w;
    acc[3] += p.fog[0] * w;
    acc[4] += p.fog[1] * w;
    acc[5] += p.fog[2] * w;
    acc[6] += p.water[0] * w;
    acc[7] += p.water[1] * w;
    acc[8] += p.water[2] * w;
  }
  return {
    sky: [Math.round(acc[0]), Math.round(acc[1]), Math.round(acc[2])],
    fog: [Math.round(acc[3]), Math.round(acc[4]), Math.round(acc[5])],
    water: [Math.round(acc[6]), Math.round(acc[7]), Math.round(acc[8])],
  };
}
