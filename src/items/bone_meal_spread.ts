// Bone meal on grass spreads tall grass + flowers in a 7×7 area
// centered on the bone-mealed block. Biome determines flower types:
//   - plains: dandelion, poppy, oxeye daisy, cornflower (all flowers)
//   - forest: roses, dandelions, poppies
//   - flower forest: huge variety (every flower)
//   - swamp: blue orchid only

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type SpreadBlock =
  | 'webmc:short_grass'
  | 'webmc:tall_grass'
  | 'webmc:dandelion'
  | 'webmc:poppy'
  | 'webmc:oxeye_daisy'
  | 'webmc:cornflower'
  | 'webmc:blue_orchid'
  | 'webmc:allium'
  | 'webmc:azure_bluet'
  | 'webmc:red_tulip'
  | 'webmc:orange_tulip'
  | 'webmc:white_tulip'
  | 'webmc:pink_tulip'
  | 'webmc:lily_of_the_valley';

export interface PlacementEvent {
  pos: Vec3;
  block: SpreadBlock;
}

export interface SpreadQuery {
  center: Vec3;
  biome: string;
  rng: () => number;
  airAt: (x: number, y: number, z: number) => boolean;
  grassAt: (x: number, y: number, z: number) => boolean;
}

const BIOME_FLOWER_POOLS: Record<string, readonly SpreadBlock[]> = {
  // Wiki: plains spawns dandelion, poppy, oxeye_daisy, cornflower, AND
  // azure_bluet. azure_bluet was missing.
  plains: [
    'webmc:dandelion',
    'webmc:poppy',
    'webmc:oxeye_daisy',
    'webmc:cornflower',
    'webmc:azure_bluet',
  ],
  forest: ['webmc:dandelion', 'webmc:poppy'],
  // Sunflower plains adds sunflower to plains pool (sunflower not in
  // SpreadBlock union — fallback: same as plains).
  flower_forest: [
    'webmc:dandelion',
    'webmc:poppy',
    'webmc:oxeye_daisy',
    'webmc:cornflower',
    'webmc:allium',
    'webmc:azure_bluet',
    'webmc:red_tulip',
    'webmc:orange_tulip',
    'webmc:white_tulip',
    'webmc:pink_tulip',
    'webmc:lily_of_the_valley',
  ],
  swamp: ['webmc:blue_orchid'],
  birch_forest: ['webmc:dandelion', 'webmc:lily_of_the_valley'],
};

const FALLBACK_POOL: readonly SpreadBlock[] = [
  'webmc:dandelion',
  'webmc:poppy',
  'webmc:oxeye_daisy',
  'webmc:cornflower',
  'webmc:azure_bluet',
];

export function boneMealGrass(q: SpreadQuery): PlacementEvent[] {
  const flowers = BIOME_FLOWER_POOLS[q.biome] ?? FALLBACK_POOL;
  const out: PlacementEvent[] = [];
  for (let dx = -3; dx <= 3; dx++) {
    for (let dz = -3; dz <= 3; dz++) {
      if (dx === 0 && dz === 0) continue;
      const x = q.center.x + dx;
      const z = q.center.z + dz;
      const y = q.center.y + 1;
      if (!q.airAt(x, y, z)) continue;
      if (!q.grassAt(x, y - 1, z)) continue;
      const r = q.rng();
      if (r < 0.08) {
        const flower = flowers[Math.floor(q.rng() * flowers.length)] ?? 'webmc:dandelion';
        out.push({ pos: { x, y, z }, block: flower });
      } else if (r < 0.7) {
        out.push({ pos: { x, y, z }, block: 'webmc:short_grass' });
      } else if (r < 0.85) {
        out.push({ pos: { x, y, z }, block: 'webmc:tall_grass' });
      }
    }
  }
  return out;
}

export function flowerPoolFor(biome: string): readonly SpreadBlock[] {
  return BIOME_FLOWER_POOLS[biome] ?? FALLBACK_POOL;
}
