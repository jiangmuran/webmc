// Flammability table. Each block has (encouragement, flammability).
// Encouragement = likelihood it catches fire; flammability = burnout rate.

export interface Flammability {
  encouragement: number;
  flammability: number;
}

const TABLE: Record<string, Flammability> = {
  oak_planks: { encouragement: 5, flammability: 20 },
  oak_log: { encouragement: 5, flammability: 5 },
  oak_leaves: { encouragement: 30, flammability: 60 },
  tall_grass: { encouragement: 60, flammability: 100 },
  wool: { encouragement: 30, flammability: 60 },
  tnt: { encouragement: 15, flammability: 100 },
  vine: { encouragement: 15, flammability: 100 },
  hay_block: { encouragement: 60, flammability: 20 },
  book_shelf: { encouragement: 30, flammability: 20 },
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
