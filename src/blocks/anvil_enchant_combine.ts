// Anvil enchantment combine. Combining an enchanted book with a tool
// adds applicable enchantments (capped by max level). Cost scales
// with enchantments added + prior-work penalty (doubled each combine).

export interface Enchantment {
  id: string;
  level: number;
}

export type EnchantMaxes = Record<string, number>;

export const ENCHANT_MAX: EnchantMaxes = {
  sharpness: 5,
  smite: 5,
  bane_of_arthropods: 5,
  fire_aspect: 2,
  knockback: 2,
  looting: 3,
  sweeping_edge: 3,
  efficiency: 5,
  silk_touch: 1,
  fortune: 3,
  unbreaking: 3,
  mending: 1,
  protection: 4,
  projectile_protection: 4,
  fire_protection: 4,
  blast_protection: 4,
  feather_falling: 4,
  power: 5,
  punch: 2,
  flame: 1,
  infinity: 1,
};

export interface CombineQuery {
  tool: {
    enchantments: Enchantment[];
    priorWorkCost: number;
  };
  bookEnchants: Enchantment[];
}

export interface CombineResult {
  mergedEnchants: Enchantment[];
  xpCost: number;
  newPriorWorkCost: number;
}

export function combineEnchants(q: CombineQuery): CombineResult {
  const merged = new Map<string, number>();
  for (const e of q.tool.enchantments) merged.set(e.id, e.level);
  let xp = 2 ** q.tool.priorWorkCost - 1;
  for (const b of q.bookEnchants) {
    const cap = ENCHANT_MAX[b.id] ?? b.level;
    const cur = merged.get(b.id);
    if (cur === undefined) {
      merged.set(b.id, Math.min(cap, b.level));
      xp += b.level;
    } else if (cur === b.level && cur < cap) {
      merged.set(b.id, cur + 1);
      xp += cur + 1;
    } else {
      merged.set(b.id, Math.max(cur, b.level));
      xp += b.level;
    }
  }
  const mergedArr: Enchantment[] = [];
  for (const [id, level] of merged) mergedArr.push({ id, level });
  return {
    mergedEnchants: mergedArr,
    xpCost: xp,
    newPriorWorkCost: q.tool.priorWorkCost + 1,
  };
}
