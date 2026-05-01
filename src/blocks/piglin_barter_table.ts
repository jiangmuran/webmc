// Piglin bartering. Giving a gold ingot to an adult piglin yields one
// of several weighted items (mostly trash, occasional treasure).

export interface BarterEntry {
  itemId: string;
  weight: number;
  min: number;
  max: number;
}

// Wiki (minecraft.wiki/w/Bartering): canonical Java table sums to
// weight 469 with 19 entries. Old table:
//   - had glowstone_dust + magma_cream — neither is in the wiki
//     bartering table.
//   - was missing water_bottle (10), dried_ghast (10), iron_nugget
//     (10), soul_sand (40) — all canonical wiki entries.
//   - used soul_speed_book (5) instead of enchanted_book_soul_speed.
//
// Sibling src/entities/bartering.ts already has the wiki-canonical
// 469-weight table; harmonised here.
export const BARTER_TABLE: BarterEntry[] = [
  { itemId: 'webmc:enchanted_book_soul_speed', weight: 5, min: 1, max: 1 },
  { itemId: 'webmc:iron_boots_soul_speed', weight: 8, min: 1, max: 1 },
  { itemId: 'webmc:splash_potion_fire_resistance', weight: 8, min: 1, max: 1 },
  { itemId: 'webmc:potion_fire_resistance', weight: 8, min: 1, max: 1 },
  { itemId: 'webmc:water_bottle', weight: 10, min: 1, max: 1 },
  { itemId: 'webmc:dried_ghast', weight: 10, min: 1, max: 1 },
  { itemId: 'webmc:iron_nugget', weight: 10, min: 10, max: 36 },
  { itemId: 'webmc:ender_pearl', weight: 10, min: 2, max: 4 },
  { itemId: 'webmc:string', weight: 20, min: 3, max: 9 },
  { itemId: 'webmc:quartz', weight: 20, min: 5, max: 12 },
  { itemId: 'webmc:obsidian', weight: 40, min: 1, max: 1 },
  { itemId: 'webmc:crying_obsidian', weight: 40, min: 1, max: 3 },
  { itemId: 'webmc:fire_charge', weight: 40, min: 1, max: 1 },
  { itemId: 'webmc:leather', weight: 40, min: 2, max: 4 },
  { itemId: 'webmc:soul_sand', weight: 40, min: 2, max: 8 },
  { itemId: 'webmc:nether_brick', weight: 40, min: 2, max: 8 },
  { itemId: 'webmc:spectral_arrow', weight: 40, min: 6, max: 12 },
  { itemId: 'webmc:gravel', weight: 40, min: 8, max: 16 },
  { itemId: 'webmc:blackstone', weight: 40, min: 8, max: 16 },
];

export interface BarterQuery {
  rand: () => number;
}

export function barter(q: BarterQuery): { itemId: string; count: number } | null {
  const total = BARTER_TABLE.reduce((s, e) => s + e.weight, 0);
  if (total <= 0) return null;
  let r = q.rand() * total;
  for (const e of BARTER_TABLE) {
    r -= e.weight;
    if (r <= 0) {
      return {
        itemId: e.itemId,
        count: e.min + Math.floor(q.rand() * (e.max - e.min + 1)),
      };
    }
  }
  return null;
}
