// Ocean ruin loot. Two tiers: cold vs warm ruins. Cold drops stone
// tools, bread, enchanted axes; warm drops emeralds, gold nuggets,
// and rare treasure maps.

export type RuinKind = 'warm' | 'cold';

export interface LootEntry {
  itemId: string;
  weight: number;
  min: number;
  max: number;
}

const COMMON: LootEntry[] = [
  { itemId: 'webmc:coal', weight: 5, min: 1, max: 4 },
  { itemId: 'webmc:wheat', weight: 5, min: 1, max: 4 },
  { itemId: 'webmc:rotten_flesh', weight: 5, min: 1, max: 4 },
];

const COLD_EXTRA: LootEntry[] = [
  { itemId: 'webmc:bread', weight: 5, min: 1, max: 4 },
  { itemId: 'webmc:stone_axe', weight: 3, min: 1, max: 1 },
  { itemId: 'webmc:enchanted_book', weight: 1, min: 1, max: 1 },
  { itemId: 'webmc:leather_tunic', weight: 2, min: 1, max: 1 },
];

const WARM_EXTRA: LootEntry[] = [
  { itemId: 'webmc:emerald', weight: 3, min: 1, max: 2 },
  { itemId: 'webmc:gold_nugget', weight: 5, min: 1, max: 10 },
  { itemId: 'webmc:buried_treasure_map', weight: 1, min: 1, max: 1 },
];

export function tableFor(kind: RuinKind): LootEntry[] {
  return [...COMMON, ...(kind === 'warm' ? WARM_EXTRA : COLD_EXTRA)];
}

export interface RollQuery {
  kind: RuinKind;
  rolls: number;
  rand: () => number;
}

export function rollRuinLoot(q: RollQuery): { itemId: string; count: number }[] {
  const table = tableFor(q.kind);
  const total = table.reduce((s, e) => s + e.weight, 0);
  const out: { itemId: string; count: number }[] = [];
  for (let i = 0; i < q.rolls; i++) {
    let r = q.rand() * total;
    for (const e of table) {
      r -= e.weight;
      if (r <= 0) {
        out.push({ itemId: e.itemId, count: e.min + Math.floor(q.rand() * (e.max - e.min + 1)) });
        break;
      }
    }
  }
  return out;
}
