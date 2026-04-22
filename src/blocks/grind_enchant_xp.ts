// Grindstone XP drop. Using the grindstone's "disenchant" function on an
// enchanted item strips the enchants and drops a small amount of XP
// (range 1..2 per enchant level, excluding curses).

export interface EnchantEntry {
  id: string;
  level: number;
}

const CURSES = new Set<string>(['curse_of_vanishing', 'curse_of_binding']);

export interface DisenchantQuery {
  enchants: readonly EnchantEntry[];
  rng: () => number;
}

export interface DisenchantResult {
  xpDropped: number;
  remainingEnchants: readonly EnchantEntry[]; // curses stay
}

export function disenchant(q: DisenchantQuery): DisenchantResult {
  let xp = 0;
  const kept: EnchantEntry[] = [];
  for (const e of q.enchants) {
    if (CURSES.has(e.id)) {
      kept.push(e);
      continue;
    }
    for (let i = 0; i < e.level; i++) {
      xp += 1 + Math.floor(q.rng() * 2); // 1 or 2
    }
  }
  return { xpDropped: xp, remainingEnchants: kept };
}

// Repair via grindstone: combines two damaged items into one with
// ~5% durability bonus (capped at max). Also clears enchants + priorWork.
export interface RepairQuery {
  leftCurrentDurability: number;
  rightCurrentDurability: number;
  maxDurability: number;
}

export function grindRepair(q: RepairQuery): number {
  const base = q.leftCurrentDurability + q.rightCurrentDurability;
  const bonus = Math.floor(q.maxDurability * 0.05);
  return Math.min(q.maxDurability, base + bonus);
}

// Curses are never removed by the grindstone (or anything else except
// /give). An item with only curses + no regular enchants still returns 0 XP.
export function isCurse(enchantId: string): boolean {
  return CURSES.has(enchantId);
}
