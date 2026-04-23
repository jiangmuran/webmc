export type MapColor = [number, number, number];

export const BIOME_BASE: Record<string, MapColor> = {
  grass: [127, 178, 56],
  sand: [247, 233, 163],
  wool: [199, 199, 199],
  fire: [255, 0, 0],
  ice: [160, 160, 255],
  metal: [167, 167, 167],
  plant: [0, 124, 0],
  snow: [255, 255, 255],
  clay: [164, 168, 184],
  dirt: [151, 109, 77],
  stone: [112, 112, 112],
  water: [64, 64, 255],
  wood: [143, 119, 72],
};

export function shadeFor(brightness: 0 | 1 | 2 | 3, base: MapColor): MapColor {
  const mult = [180, 220, 255, 135][brightness] / 255;
  return [
    Math.round(base[0] * mult),
    Math.round(base[1] * mult),
    Math.round(base[2] * mult),
  ];
}

export function colorForBlock(block: string): MapColor {
  return BIOME_BASE[block] ?? BIOME_BASE['stone'] ?? [0, 0, 0];
}
