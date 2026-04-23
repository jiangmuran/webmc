// Grindstone: strip enchantments from items + repair. Returns XP
// refund equal to sum of enchant cost values (capped).

export interface GrindInput {
  leftItem: {
    durability: number;
    maxDurability: number;
    enchantments: { id: string; level: number }[];
  } | null;
  rightItem: {
    durability: number;
    maxDurability: number;
    enchantments: { id: string; level: number }[];
  } | null;
}

export const CURSE_IDS = new Set(['curse_of_vanishing', 'curse_of_binding']);

export function stripped(input: GrindInput): typeof input.leftItem {
  if (!input.leftItem) return null;
  return {
    durability: input.leftItem.durability,
    maxDurability: input.leftItem.maxDurability,
    enchantments: input.leftItem.enchantments.filter((e) => CURSE_IDS.has(e.id)),
  };
}

export function xpRefund(input: GrindInput): number {
  if (!input.leftItem) return 0;
  return input.leftItem.enchantments
    .filter((e) => !CURSE_IDS.has(e.id))
    .reduce((s, e) => s + e.level, 0);
}

export function combineDurabilities(a: number, b: number, max: number): number {
  return Math.min(max, a + b + Math.floor(max * 0.05));
}
