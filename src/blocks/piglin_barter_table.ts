// Piglin bartering. Giving a gold ingot to an adult piglin yields one
// of several weighted items (mostly trash, occasional treasure).

export interface BarterEntry {
  itemId: string;
  weight: number;
  min: number;
  max: number;
}

export const BARTER_TABLE: BarterEntry[] = [
  { itemId: 'webmc:soul_speed_book', weight: 5, min: 1, max: 1 },
  { itemId: 'webmc:iron_boots_soul_speed', weight: 8, min: 1, max: 1 },
  { itemId: 'webmc:splash_potion_fire_resistance', weight: 8, min: 1, max: 1 },
  { itemId: 'webmc:potion_fire_resistance', weight: 8, min: 1, max: 1 },
  { itemId: 'webmc:quartz', weight: 20, min: 5, max: 12 },
  { itemId: 'webmc:glowstone_dust', weight: 20, min: 5, max: 12 },
  { itemId: 'webmc:magma_cream', weight: 20, min: 2, max: 6 },
  { itemId: 'webmc:ender_pearl', weight: 10, min: 2, max: 4 },
  { itemId: 'webmc:string', weight: 20, min: 8, max: 24 },
  { itemId: 'webmc:obsidian', weight: 40, min: 1, max: 1 },
  { itemId: 'webmc:gravel', weight: 40, min: 8, max: 16 },
  { itemId: 'webmc:leather', weight: 40, min: 4, max: 10 },
  { itemId: 'webmc:nether_brick', weight: 40, min: 4, max: 16 },
  { itemId: 'webmc:spectral_arrow', weight: 10, min: 6, max: 12 },
  { itemId: 'webmc:blackstone', weight: 40, min: 8, max: 16 },
  { itemId: 'webmc:crying_obsidian', weight: 10, min: 1, max: 3 },
  { itemId: 'webmc:fire_charge', weight: 40, min: 1, max: 1 },
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
