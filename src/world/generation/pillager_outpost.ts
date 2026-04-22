// Pillager outpost. 7×7×11 cobblestone tower with a wooden roof; spawns
// in plains/taiga/desert/savanna/snowy biomes at least 10 chunks from
// any village. Roof chest contains raid captain loot; ~5 pillagers and
// 1 captain spawn with the structure.

export interface PillagerOutpostLayout {
  size: { width: number; height: number; depth: number };
  captainCount: number;
  pillagerCount: number;
  roofChest: boolean;
  sideCages: number; // small cages with 1 allay sometimes
}

export function outpostLayout(): PillagerOutpostLayout {
  return {
    size: { width: 7, height: 11, depth: 7 },
    captainCount: 1,
    pillagerCount: 5,
    roofChest: true,
    sideCages: 2,
  };
}

export interface OutpostLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

export const OUTPOST_ROOF_LOOT: readonly OutpostLootEntry[] = [
  { item: 'webmc:crossbow', weight: 1, min: 1, max: 1 },
  { item: 'webmc:dark_oak_log', weight: 10, min: 2, max: 6 },
  { item: 'webmc:iron_ingot', weight: 20, min: 1, max: 2 },
  { item: 'webmc:wheat', weight: 30, min: 3, max: 5 },
  { item: 'webmc:potato', weight: 20, min: 3, max: 5 },
  { item: 'webmc:tripwire_hook', weight: 10, min: 1, max: 2 },
  { item: 'webmc:arrow', weight: 25, min: 2, max: 10 },
  { item: 'webmc:enchanted_book', weight: 3, min: 1, max: 1 },
];

export function rollOutpostLoot(roll: number): OutpostLootEntry | null {
  const total = OUTPOST_ROOF_LOOT.reduce((s, e) => s + e.weight, 0);
  if (total <= 0) return null;
  const target = roll * total;
  let acc = 0;
  for (const e of OUTPOST_ROOF_LOOT) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return OUTPOST_ROOF_LOOT[OUTPOST_ROOF_LOOT.length - 1] ?? null;
}

// Minimum chunk distance between an outpost and any village. MC uses 10
// chunks (160 blocks) as the "exclusion zone".
export const MIN_VILLAGE_DISTANCE_CHUNKS = 10;

export function canSpawnOutpost(
  candidateChunk: { cx: number; cz: number },
  nearestVillageChunk: { cx: number; cz: number } | null,
): boolean {
  if (!nearestVillageChunk) return true;
  const dx = candidateChunk.cx - nearestVillageChunk.cx;
  const dz = candidateChunk.cz - nearestVillageChunk.cz;
  return Math.hypot(dx, dz) >= MIN_VILLAGE_DISTANCE_CHUNKS;
}
