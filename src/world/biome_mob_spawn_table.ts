// Biome mob spawn weight table. The world spawns mobs by picking a
// category (monster, creature, ambient, water_creature, water_ambient,
// misc, axolotls, underground_water_creature) and then rolling within
// the biome's weighted pool for that category. This is the weighted
// lookup layer; actual spawn-rule gating (light level, block type,
// entity cap) is in spawn_rules.ts.

export type MobCategory =
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'water_creature'
  | 'water_ambient'
  | 'misc'
  | 'axolotls'
  | 'underground_water_creature';

export interface SpawnEntry {
  readonly mob: string;
  readonly weight: number;
  readonly minGroup: number;
  readonly maxGroup: number;
}

type BiomeCategoryPool = Partial<Record<MobCategory, readonly SpawnEntry[]>>;

const BIOMES: Record<string, BiomeCategoryPool> = {
  forest: {
    creature: [
      { mob: 'sheep', weight: 12, minGroup: 4, maxGroup: 4 },
      { mob: 'pig', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'chicken', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'cow', weight: 8, minGroup: 4, maxGroup: 4 },
      { mob: 'wolf', weight: 5, minGroup: 4, maxGroup: 4 },
      { mob: 'fox', weight: 5, minGroup: 2, maxGroup: 4 },
    ],
    monster: [
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'enderman', weight: 10, minGroup: 1, maxGroup: 4 },
    ],
  },
  plains: {
    creature: [
      { mob: 'sheep', weight: 12, minGroup: 4, maxGroup: 4 },
      { mob: 'cow', weight: 8, minGroup: 4, maxGroup: 4 },
      { mob: 'pig', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'chicken', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'horse', weight: 5, minGroup: 2, maxGroup: 6 },
      { mob: 'donkey', weight: 1, minGroup: 1, maxGroup: 3 },
    ],
    monster: [
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'enderman', weight: 10, minGroup: 1, maxGroup: 4 },
      { mob: 'witch', weight: 5, minGroup: 1, maxGroup: 1 },
    ],
    ambient: [{ mob: 'bat', weight: 10, minGroup: 8, maxGroup: 8 }],
  },
  ocean: {
    water_creature: [
      { mob: 'squid', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'cod', weight: 15, minGroup: 3, maxGroup: 6 },
      { mob: 'salmon', weight: 10, minGroup: 1, maxGroup: 5 },
      { mob: 'dolphin', weight: 2, minGroup: 1, maxGroup: 2 },
    ],
    water_ambient: [{ mob: 'tropical_fish', weight: 5, minGroup: 1, maxGroup: 4 }],
    monster: [{ mob: 'drowned', weight: 5, minGroup: 1, maxGroup: 1 }],
  },
  nether_wastes: {
    monster: [
      { mob: 'zombified_piglin', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'ghast', weight: 50, minGroup: 4, maxGroup: 4 },
      { mob: 'magma_cube', weight: 2, minGroup: 4, maxGroup: 4 },
      { mob: 'piglin', weight: 15, minGroup: 2, maxGroup: 4 },
      { mob: 'enderman', weight: 1, minGroup: 4, maxGroup: 4 },
    ],
  },
  the_end: {
    monster: [{ mob: 'enderman', weight: 10, minGroup: 4, maxGroup: 4 }],
  },
  lush_cave: {
    axolotls: [{ mob: 'axolotl', weight: 10, minGroup: 1, maxGroup: 3 }],
    underground_water_creature: [{ mob: 'glow_squid', weight: 10, minGroup: 1, maxGroup: 3 }],
  },
  desert: {
    monster: [
      { mob: 'husk', weight: 80, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'enderman', weight: 10, minGroup: 1, maxGroup: 4 },
    ],
    creature: [{ mob: 'rabbit', weight: 4, minGroup: 2, maxGroup: 3 }],
  },
  swamp: {
    monster: [
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'witch', weight: 5, minGroup: 1, maxGroup: 1 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
    ],
    creature: [
      { mob: 'sheep', weight: 12, minGroup: 4, maxGroup: 4 },
      { mob: 'frog', weight: 10, minGroup: 2, maxGroup: 5 },
    ],
  },
  jungle: {
    creature: [
      { mob: 'pig', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'chicken', weight: 10, minGroup: 4, maxGroup: 4 },
      { mob: 'parrot', weight: 40, minGroup: 1, maxGroup: 2 },
      { mob: 'panda', weight: 1, minGroup: 1, maxGroup: 2 },
    ],
    monster: [
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
    ],
  },
  taiga: {
    creature: [
      { mob: 'wolf', weight: 8, minGroup: 4, maxGroup: 4 },
      { mob: 'sheep', weight: 12, minGroup: 4, maxGroup: 4 },
      { mob: 'cow', weight: 8, minGroup: 4, maxGroup: 4 },
      { mob: 'rabbit', weight: 4, minGroup: 2, maxGroup: 3 },
      { mob: 'fox', weight: 8, minGroup: 2, maxGroup: 4 },
    ],
    monster: [
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
    ],
  },
  savanna: {
    creature: [
      { mob: 'horse', weight: 1, minGroup: 2, maxGroup: 6 },
      { mob: 'cow', weight: 8, minGroup: 4, maxGroup: 4 },
      { mob: 'sheep', weight: 12, minGroup: 4, maxGroup: 4 },
      { mob: 'llama', weight: 8, minGroup: 4, maxGroup: 4 },
    ],
    monster: [
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
    ],
  },
  snowy: {
    creature: [{ mob: 'rabbit', weight: 10, minGroup: 2, maxGroup: 3 }],
    monster: [
      { mob: 'stray', weight: 80, minGroup: 4, maxGroup: 4 },
      { mob: 'skeleton', weight: 20, minGroup: 4, maxGroup: 4 },
      { mob: 'creeper', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'spider', weight: 100, minGroup: 4, maxGroup: 4 },
      { mob: 'zombie', weight: 95, minGroup: 4, maxGroup: 4 },
    ],
  },
  mushroom_fields: {
    creature: [{ mob: 'mooshroom', weight: 8, minGroup: 4, maxGroup: 8 }],
  },
  deep_dark: {
    monster: [{ mob: 'warden', weight: 1, minGroup: 1, maxGroup: 1 }],
  },
  river: {
    water_creature: [{ mob: 'salmon', weight: 5, minGroup: 1, maxGroup: 5 }],
  },
};

export function poolOf(biome: string, category: MobCategory): readonly SpawnEntry[] {
  return BIOMES[biome]?.[category] ?? [];
}

// Weighted pick by roll [0, 1).
export function pickSpawn(biome: string, category: MobCategory, roll: number): SpawnEntry | null {
  const pool = poolOf(biome, category);
  if (pool.length === 0) return null;
  const total = pool.reduce((s, e) => s + e.weight, 0);
  if (total === 0) return null;
  const target = roll * total;
  let acc = 0;
  for (const e of pool) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return pool[pool.length - 1] ?? null;
}
