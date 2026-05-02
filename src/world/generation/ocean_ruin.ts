// Ocean ruins. Two variants: warm (sandstone) and cold (stone brick),
// each with 5 sub-shapes. Contain 1 chest + buried-treasure map in 30%
// of cases; drowned mobs spawn in the ruins.

export type OceanRuinVariant = 'warm' | 'cold';
export type OceanRuinShape = 'house' | 'tower' | 'shrine' | 'big_room' | 'small_hut';

export interface OceanRuinLayout {
  variant: OceanRuinVariant;
  shape: OceanRuinShape;
  sizeBlocks: { w: number; h: number; d: number };
  drownedCount: number;
  hasChest: boolean;
  hasBuriedTreasureMap: boolean;
}

const SHAPE_SIZE: Record<OceanRuinShape, { w: number; h: number; d: number }> = {
  house: { w: 7, h: 5, d: 8 },
  tower: { w: 5, h: 11, d: 5 },
  shrine: { w: 7, h: 6, d: 7 },
  big_room: { w: 10, h: 7, d: 10 },
  small_hut: { w: 5, h: 4, d: 5 },
};

export interface OceanRuinQuery {
  variant: OceanRuinVariant;
  rng: () => number;
}

export function planOceanRuin(q: OceanRuinQuery): OceanRuinLayout {
  const shapes: OceanRuinShape[] = ['house', 'tower', 'shrine', 'big_room', 'small_hut'];
  const shape = shapes[Math.min(shapes.length - 1, Math.floor(q.rng() * shapes.length))] ?? 'house';
  const hasChest = q.rng() < 0.5;
  const hasMap = hasChest && q.rng() < 0.6;
  return {
    variant: q.variant,
    shape,
    sizeBlocks: SHAPE_SIZE[shape],
    drownedCount: 2 + Math.floor(q.rng() * 3),
    hasChest,
    hasBuriedTreasureMap: hasMap,
  };
}

export interface OceanRuinLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

// Wiki (minecraft.wiki/w/Ocean_Ruins): Java loot table includes
// leather_helmet + leather_chestplate (not Bedrock 'leather_cap' /
// 'leather_tunic'). AGENT_CHARTER targets Java; same naming fix
// applied to world/generation/buried_treasure.ts in an earlier
// audit pass.
export const OCEAN_RUIN_LOOT: readonly OceanRuinLootEntry[] = [
  { item: 'webmc:map_buried_treasure', weight: 10, min: 1, max: 1 },
  { item: 'webmc:emerald', weight: 5, min: 1, max: 1 },
  { item: 'webmc:wheat', weight: 10, min: 1, max: 2 },
  { item: 'webmc:coal', weight: 15, min: 1, max: 4 },
  { item: 'webmc:rotten_flesh', weight: 25, min: 1, max: 3 },
  { item: 'webmc:leather_helmet', weight: 5, min: 1, max: 1 },
  { item: 'webmc:leather_chestplate', weight: 5, min: 1, max: 1 },
  { item: 'webmc:fishing_rod', weight: 5, min: 1, max: 1 },
  { item: 'webmc:enchanted_book', weight: 5, min: 1, max: 1 },
  { item: 'webmc:gold_nugget', weight: 10, min: 1, max: 3 },
];

export function rollOceanRuinLoot(roll: number): OceanRuinLootEntry | null {
  const total = OCEAN_RUIN_LOOT.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of OCEAN_RUIN_LOOT) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return OCEAN_RUIN_LOOT[OCEAN_RUIN_LOOT.length - 1] ?? null;
}
