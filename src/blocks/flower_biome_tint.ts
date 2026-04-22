// Biome-tinted flower / plant colors. In MC, tall grass, fern, vines,
// sugarcane, and lily pad pick up the biome grass color. A subset of
// flowers (dandelion, oxeye daisy, etc.) use fixed colors instead.

import { foliageOf, type RGB } from '@/world/biome_foliage_color';

const PLANT_USES_GRASS_COLOR = new Set<string>([
  'webmc:tall_grass',
  'webmc:fern',
  'webmc:large_fern',
  'webmc:short_grass',
  'webmc:vine',
  'webmc:sugar_cane',
  'webmc:lily_pad',
  'webmc:hanging_roots',
]);

// Flowers with a fixed "paint" color per species — these don't tint.
export const FLOWER_FIXED_COLORS: Record<string, RGB> = {
  'webmc:dandelion': [255, 236, 79],
  'webmc:poppy': [237, 48, 44],
  'webmc:blue_orchid': [42, 204, 231],
  'webmc:allium': [178, 107, 196],
  'webmc:azure_bluet': [231, 231, 231],
  'webmc:red_tulip': [237, 48, 44],
  'webmc:orange_tulip': [248, 133, 44],
  'webmc:white_tulip': [231, 231, 231],
  'webmc:pink_tulip': [255, 178, 204],
  'webmc:oxeye_daisy': [255, 255, 255],
  'webmc:cornflower': [79, 113, 255],
  'webmc:lily_of_the_valley': [242, 242, 242],
  'webmc:wither_rose': [29, 29, 29],
  'webmc:sunflower': [255, 202, 55],
  'webmc:lilac': [197, 158, 207],
  'webmc:rose_bush': [237, 48, 44],
  'webmc:peony': [232, 197, 210],
  'webmc:torchflower': [255, 202, 55],
  'webmc:pitcher_plant': [142, 82, 135],
  'webmc:closed_eyeblossom': [80, 80, 80],
  'webmc:open_eyeblossom': [220, 180, 90],
};

export function plantColor(blockId: string, biome: string): RGB {
  if (PLANT_USES_GRASS_COLOR.has(blockId)) {
    return foliageOf(biome).grass;
  }
  const fixed = FLOWER_FIXED_COLORS[blockId];
  if (fixed) return fixed;
  return [255, 255, 255];
}

export function usesGrassTint(blockId: string): boolean {
  return PLANT_USES_GRASS_COLOR.has(blockId);
}
