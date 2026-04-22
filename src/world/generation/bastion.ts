// Nether bastion remnant. Four variants: Housing Units, Stables, Hoglin
// Stables, and Treasure. Each variant has piglins/piglin brutes and
// unique loot tables. Treasure variant has a magma cube spawner room.

export type BastionVariant = 'housing_units' | 'stables' | 'hoglin_stables' | 'treasure';

export interface BastionLayout {
  variant: BastionVariant;
  brutes: number;
  piglins: number;
  hoglins: number;
  gildedBlackstoneBlocks: number;
  chests: number;
}

export function planBastion(variant: BastionVariant): BastionLayout {
  switch (variant) {
    case 'housing_units':
      return {
        variant,
        brutes: 2,
        piglins: 12,
        hoglins: 0,
        gildedBlackstoneBlocks: 8,
        chests: 3,
      };
    case 'stables':
      return {
        variant,
        brutes: 1,
        piglins: 10,
        hoglins: 2,
        gildedBlackstoneBlocks: 6,
        chests: 2,
      };
    case 'hoglin_stables':
      return {
        variant,
        brutes: 1,
        piglins: 8,
        hoglins: 6,
        gildedBlackstoneBlocks: 4,
        chests: 2,
      };
    case 'treasure':
      return {
        variant,
        brutes: 3,
        piglins: 6,
        hoglins: 0,
        gildedBlackstoneBlocks: 30,
        chests: 4,
      };
  }
}

export interface BastionLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

const TREASURE_LOOT: readonly BastionLootEntry[] = [
  { item: 'webmc:netherite_ingot', weight: 1, min: 1, max: 1 },
  { item: 'webmc:ancient_debris', weight: 12, min: 1, max: 2 },
  { item: 'webmc:netherite_scrap', weight: 8, min: 1, max: 2 },
  { item: 'webmc:diamond_sword', weight: 6, min: 1, max: 1 },
  { item: 'webmc:enchanted_golden_apple', weight: 3, min: 1, max: 1 },
  { item: 'webmc:golden_apple', weight: 10, min: 1, max: 3 },
  { item: 'webmc:gold_block', weight: 5, min: 1, max: 3 },
  { item: 'webmc:gold_ingot', weight: 15, min: 9, max: 36 },
  { item: 'webmc:ender_pearl', weight: 5, min: 2, max: 6 },
];

const GENERIC_LOOT: readonly BastionLootEntry[] = [
  { item: 'webmc:crying_obsidian', weight: 15, min: 1, max: 3 },
  { item: 'webmc:magma_cream', weight: 10, min: 1, max: 2 },
  { item: 'webmc:gold_ingot', weight: 20, min: 1, max: 5 },
  { item: 'webmc:iron_ingot', weight: 15, min: 1, max: 5 },
  { item: 'webmc:string', weight: 15, min: 1, max: 6 },
  { item: 'webmc:arrow', weight: 10, min: 5, max: 17 },
  { item: 'webmc:spectral_arrow', weight: 5, min: 5, max: 12 },
  { item: 'webmc:crossbow', weight: 5, min: 1, max: 1 },
];

export function rollBastionLoot(variant: BastionVariant, roll: number): BastionLootEntry | null {
  const pool = variant === 'treasure' ? TREASURE_LOOT : GENERIC_LOOT;
  const total = pool.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of pool) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return pool[pool.length - 1] ?? null;
}
