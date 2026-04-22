// Desert pyramid (desert_temple). 21×21×15 sandstone pyramid with 4 chests
// around a central TNT trap under a pressure plate. Stepping on the plate
// ignites 9 TNT, destroying the floor and the player if unshielded.

export interface DesertTempleLayout {
  size: { width: number; height: number; depth: number };
  chestCount: number;
  tntCount: number;
  trapPlatePos: { x: number; y: number; z: number };
}

export function desertTempleLayout(anchor: {
  x: number;
  y: number;
  z: number;
}): DesertTempleLayout {
  return {
    size: { width: 21, height: 15, depth: 21 },
    chestCount: 4,
    tntCount: 9,
    trapPlatePos: { x: anchor.x + 10, y: anchor.y + 1, z: anchor.z + 10 },
  };
}

export type DesertTempleLoot =
  | 'diamond'
  | 'emerald'
  | 'gold_ingot'
  | 'iron_ingot'
  | 'bone'
  | 'rotten_flesh'
  | 'spider_eye'
  | 'string'
  | 'enchanted_book'
  | 'saddle'
  | 'horse_armor_gold'
  | 'horse_armor_iron';

export interface LootEntry {
  kind: DesertTempleLoot;
  weight: number;
}

export const DESERT_TEMPLE_LOOT: readonly LootEntry[] = [
  { kind: 'diamond', weight: 5 },
  { kind: 'emerald', weight: 2 },
  { kind: 'gold_ingot', weight: 15 },
  { kind: 'iron_ingot', weight: 15 },
  { kind: 'bone', weight: 25 },
  { kind: 'rotten_flesh', weight: 25 },
  { kind: 'spider_eye', weight: 10 },
  { kind: 'string', weight: 10 },
  { kind: 'enchanted_book', weight: 8 },
  { kind: 'saddle', weight: 12 },
  { kind: 'horse_armor_gold', weight: 2 },
  { kind: 'horse_armor_iron', weight: 5 },
];

export function rollDesertTempleLoot(roll: number): DesertTempleLoot {
  const total = DESERT_TEMPLE_LOOT.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of DESERT_TEMPLE_LOOT) {
    acc += e.weight;
    if (target < acc) return e.kind;
  }
  return 'bone';
}

// Pressure plate → TNT ignition delay (ticks). In MC the plate powers all
// 9 TNT simultaneously, so delay is fuse time (80 ticks = 4s).
export const TNT_FUSE_TICKS = 80;
