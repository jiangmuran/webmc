// Dungeon / stronghold / desert temple chest loot tables.

export interface Entry {
  itemId: string;
  weight: number;
  min: number;
  max: number;
}

export const DUNGEON_CHEST: Entry[] = [
  { itemId: 'webmc:saddle', weight: 10, min: 1, max: 1 },
  { itemId: 'webmc:bread', weight: 10, min: 1, max: 1 },
  { itemId: 'webmc:bone', weight: 10, min: 1, max: 8 },
  { itemId: 'webmc:gunpowder', weight: 10, min: 1, max: 8 },
  { itemId: 'webmc:string', weight: 10, min: 1, max: 8 },
  { itemId: 'webmc:wheat', weight: 10, min: 1, max: 4 },
  { itemId: 'webmc:iron_ingot', weight: 10, min: 1, max: 4 },
  { itemId: 'webmc:enchanted_book', weight: 1, min: 1, max: 1 },
];

export const STRONGHOLD_LIBRARY_CHEST: Entry[] = [
  { itemId: 'webmc:book', weight: 20, min: 1, max: 3 },
  { itemId: 'webmc:paper', weight: 20, min: 2, max: 7 },
  { itemId: 'webmc:compass', weight: 1, min: 1, max: 1 },
  { itemId: 'webmc:map', weight: 1, min: 1, max: 1 },
  { itemId: 'webmc:enchanted_book', weight: 10, min: 1, max: 1 },
];

export const DESERT_TEMPLE_CHEST: Entry[] = [
  { itemId: 'webmc:diamond', weight: 5, min: 1, max: 3 },
  { itemId: 'webmc:gold_ingot', weight: 15, min: 2, max: 7 },
  { itemId: 'webmc:emerald', weight: 15, min: 1, max: 3 },
  { itemId: 'webmc:iron_ingot', weight: 15, min: 1, max: 5 },
  { itemId: 'webmc:bone', weight: 25, min: 4, max: 6 },
  { itemId: 'webmc:rotten_flesh', weight: 25, min: 3, max: 7 },
];

export interface RollQuery {
  table: Entry[];
  rolls: number;
  rand: () => number;
}

export function rollStructure(q: RollQuery): { itemId: string; count: number }[] {
  const total = q.table.reduce((s, e) => s + e.weight, 0);
  const out: { itemId: string; count: number }[] = [];
  for (let i = 0; i < q.rolls; i++) {
    let r = q.rand() * total;
    for (const e of q.table) {
      r -= e.weight;
      if (r <= 0) {
        out.push({
          itemId: e.itemId,
          count: e.min + Math.floor(q.rand() * (e.max - e.min + 1)),
        });
        break;
      }
    }
  }
  return out;
}
