// Flammability table. Each block has (encouragement, flammability).
// Encouragement = likelihood it catches fire; flammability = burnout rate.

export interface Flammability {
  encouragement: number;
  flammability: number;
}

// Wiki (minecraft.wiki/w/Fire) per-block flammability values. Old
// table had the bookshelf key spelled `book_shelf` (with underscore)
// — the canonical block ID is `bookshelf` (one word). Lookups via
// the actual ID silently returned the {0, 0} default, so a
// bookshelf wall ignored fire entirely (instead of igniting at
// encouragement 30 / burning out at flammability 20).
const TABLE: Record<string, Flammability> = {
  oak_planks: { encouragement: 5, flammability: 20 },
  oak_log: { encouragement: 5, flammability: 5 },
  oak_leaves: { encouragement: 30, flammability: 60 },
  tall_grass: { encouragement: 60, flammability: 100 },
  wool: { encouragement: 30, flammability: 60 },
  tnt: { encouragement: 15, flammability: 100 },
  vine: { encouragement: 15, flammability: 100 },
  hay_block: { encouragement: 60, flammability: 20 },
  bookshelf: { encouragement: 30, flammability: 20 },
  stone: { encouragement: 0, flammability: 0 },
};

export function flammabilityOf(id: string): Flammability {
  return TABLE[id] ?? { encouragement: 0, flammability: 0 };
}

export function isFlammable(id: string): boolean {
  return flammabilityOf(id).flammability > 0;
}

export function burnoutChance(id: string): number {
  return flammabilityOf(id).flammability / 100;
}
