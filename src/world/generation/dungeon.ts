// Simple dungeon: a 5x5 mossy-cobblestone/cobblestone-floor room with a
// mob spawner (zombie/skeleton/spider) in the center and 1-2 chests.

export type DungeonSpawner = 'zombie' | 'skeleton' | 'spider';

export interface DungeonLayout {
  spawner: DungeonSpawner;
  floorSize: { width: number; depth: number };
  chestCount: number;
}

export interface DungeonQuery {
  rng: () => number;
}

export function planDungeon(q: DungeonQuery): DungeonLayout {
  const spawnerRoll = q.rng();
  const spawner: DungeonSpawner =
    spawnerRoll < 0.5 ? 'zombie' : spawnerRoll < 0.75 ? 'skeleton' : 'spider';
  const chestCount = q.rng() < 0.5 ? 2 : 1;
  return {
    spawner,
    floorSize: { width: 5, depth: 5 },
    chestCount,
  };
}

export interface DungeonLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

export const DUNGEON_LOOT: readonly DungeonLootEntry[] = [
  { item: 'webmc:saddle', weight: 20, min: 1, max: 1 },
  { item: 'webmc:iron_ingot', weight: 10, min: 1, max: 4 },
  { item: 'webmc:gold_ingot', weight: 5, min: 1, max: 4 },
  { item: 'webmc:bread', weight: 20, min: 1, max: 1 },
  { item: 'webmc:wheat', weight: 20, min: 1, max: 4 },
  { item: 'webmc:bucket', weight: 10, min: 1, max: 1 },
  { item: 'webmc:redstone', weight: 5, min: 1, max: 4 },
  { item: 'webmc:enchanted_book', weight: 10, min: 1, max: 1 },
  { item: 'webmc:music_disc_13', weight: 5, min: 1, max: 1 },
  { item: 'webmc:music_disc_cat', weight: 5, min: 1, max: 1 },
  { item: 'webmc:name_tag', weight: 10, min: 1, max: 1 },
  { item: 'webmc:golden_apple', weight: 10, min: 1, max: 1 },
  { item: 'webmc:horse_armor_gold', weight: 10, min: 1, max: 1 },
  { item: 'webmc:horse_armor_iron', weight: 15, min: 1, max: 1 },
];

export function rollDungeonLoot(roll: number): DungeonLootEntry | null {
  const total = DUNGEON_LOOT.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of DUNGEON_LOOT) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return DUNGEON_LOOT[DUNGEON_LOOT.length - 1] ?? null;
}

// Dungeon spawner activation: spawns 1-4 mobs when player within 16
// blocks; capped at 6 mobs alive nearby; 10-40 tick delay between spawns.
export interface SpawnerConfig {
  minDelayTicks: number;
  maxDelayTicks: number;
  maxNearbyMobs: number;
  activationRadius: number;
}

export const DEFAULT_SPAWNER_CONFIG: SpawnerConfig = {
  minDelayTicks: 200,
  maxDelayTicks: 800,
  maxNearbyMobs: 6,
  activationRadius: 16,
};
