// Buried treasure. Single chest buried 1-3 blocks below the surface on
// beaches. Discoverable only via a buried-treasure map (dropped from
// shipwrecks). Contains iron ingots, gold ingots, a heart of the sea,
// and sometimes TNT.

export interface BuriedTreasureLayout {
  chestDepth: number; // how many blocks below the top grass/sand
  hasHeartOfTheSea: boolean;
}

export interface BuriedTreasureQuery {
  rng: () => number;
}

export function planBuriedTreasure(q: BuriedTreasureQuery): BuriedTreasureLayout {
  return {
    chestDepth: 1 + Math.floor(q.rng() * 3),
    hasHeartOfTheSea: true, // always present in MC
  };
}

export interface TreasureLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
  guaranteed?: boolean;
}

export const TREASURE_LOOT: readonly TreasureLootEntry[] = [
  { item: 'webmc:heart_of_the_sea', weight: 1, min: 1, max: 1, guaranteed: true },
  { item: 'webmc:iron_ingot', weight: 20, min: 1, max: 4 },
  { item: 'webmc:gold_ingot', weight: 10, min: 1, max: 4 },
  { item: 'webmc:tnt', weight: 5, min: 1, max: 2 },
  { item: 'webmc:emerald', weight: 5, min: 1, max: 4 },
  { item: 'webmc:diamond', weight: 5, min: 1, max: 2 },
  { item: 'webmc:prismarine_crystals', weight: 5, min: 1, max: 5 },
  { item: 'webmc:leather_cap', weight: 10, min: 1, max: 1 },
  { item: 'webmc:leather_tunic', weight: 10, min: 1, max: 1 },
  { item: 'webmc:cooked_cod', weight: 10, min: 2, max: 4 },
  { item: 'webmc:cooked_salmon', weight: 10, min: 2, max: 4 },
  { item: 'webmc:potion_water_breathing', weight: 5, min: 1, max: 1 },
];

export function rollTreasureLoot(roll: number): TreasureLootEntry | null {
  const pool = TREASURE_LOOT.filter((e) => !e.guaranteed);
  const total = pool.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of pool) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return pool[pool.length - 1] ?? null;
}

// Guaranteed items always appear exactly once per chest.
export function guaranteedTreasure(): TreasureLootEntry[] {
  return TREASURE_LOOT.filter((e) => e.guaranteed === true);
}
