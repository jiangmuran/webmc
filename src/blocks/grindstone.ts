// Grindstone — disenchants + repairs items. Two slots (can accept one or
// two tools of the same kind). Output: repaired durability (sum up to max)
// and NO enchantments except curses.

import type { Enchanted } from '@/items/enchantment';

const CURSE_ENCHANTS = new Set(['curse_of_binding', 'curse_of_vanishing']);

export interface GrindstoneQuery {
  left: Enchanted;
  right: Enchanted | null;
  maxDurability: number;
}

export interface GrindstoneResult {
  output: Enchanted;
  xpReturn: number;
}

export function grindstone(q: GrindstoneQuery): GrindstoneResult {
  const { left, right, maxDurability } = q;
  let repairedDamage = left.damage;
  if (right?.itemId === left.itemId) {
    const leftDurabilityLeft = maxDurability - left.damage;
    const rightDurabilityLeft = maxDurability - right.damage;
    const combined = leftDurabilityLeft + rightDurabilityLeft + Math.floor(maxDurability * 0.05);
    repairedDamage = Math.max(0, maxDurability - combined);
  }
  const keptEnchants = new Map<string, number>();
  const surrender = (stack: Enchanted): number => {
    if (!stack.enchants) return 0;
    let xp = 0;
    for (const [id, lvl] of stack.enchants) {
      if (CURSE_ENCHANTS.has(id)) {
        keptEnchants.set(id, Math.max(keptEnchants.get(id) ?? 0, lvl));
      } else {
        // Approximate XP return scaling with enchant level.
        xp += lvl * 2 + 2;
      }
    }
    return xp;
  };
  const xpReturn = surrender(left) + (right ? surrender(right) : 0);
  const { enchants: _strippedEnchants, ...rest } = left;
  void _strippedEnchants;
  const output: Enchanted = {
    ...rest,
    damage: repairedDamage,
    ...(keptEnchants.size > 0 ? { enchants: keptEnchants } : {}),
  };
  return { output, xpReturn };
}
