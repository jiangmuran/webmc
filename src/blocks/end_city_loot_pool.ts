// End city chest loot. Towers and ships in end cities contain a
// weighted set of items. Elytra is exclusive to ship item frame.

export interface LootRoll {
  itemId: string;
  weight: number;
  minCount: number;
  maxCount: number;
}

export const END_CITY_TOWER_CHEST: LootRoll[] = [
  { itemId: 'webmc:diamond', weight: 5, minCount: 1, maxCount: 4 },
  { itemId: 'webmc:iron_ingot', weight: 20, minCount: 2, maxCount: 8 },
  { itemId: 'webmc:gold_ingot', weight: 15, minCount: 2, maxCount: 8 },
  { itemId: 'webmc:emerald', weight: 10, minCount: 2, maxCount: 6 },
  { itemId: 'webmc:beetroot_seeds', weight: 5, minCount: 1, maxCount: 10 },
  { itemId: 'webmc:diamond_sword', weight: 3, minCount: 1, maxCount: 1 },
  { itemId: 'webmc:diamond_chestplate', weight: 3, minCount: 1, maxCount: 1 },
  { itemId: 'webmc:iron_shovel', weight: 6, minCount: 1, maxCount: 1 },
];

export const END_CITY_SHIP_ELYTRA: LootRoll = {
  itemId: 'webmc:elytra',
  weight: 1,
  minCount: 1,
  maxCount: 1,
};

export interface RollQuery {
  table: LootRoll[];
  rolls: number;
  rand: () => number;
}

export function rollTable(q: RollQuery): { itemId: string; count: number }[] {
  const out: { itemId: string; count: number }[] = [];
  const total = q.table.reduce((s, r) => s + r.weight, 0);
  for (let i = 0; i < q.rolls; i++) {
    let r = q.rand() * total;
    for (const entry of q.table) {
      r -= entry.weight;
      if (r <= 0) {
        const count = entry.minCount + Math.floor(q.rand() * (entry.maxCount - entry.minCount + 1));
        out.push({ itemId: entry.itemId, count });
        break;
      }
    }
  }
  return out;
}
