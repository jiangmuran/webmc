export interface EnchantOdds {
  id: string;
  weight: number;
  minLevel: number;
  maxLevel: number;
}

export const ENCHANT_TABLE: readonly EnchantOdds[] = [
  { id: 'protection', weight: 10, minLevel: 1, maxLevel: 4 },
  { id: 'blast_protection', weight: 2, minLevel: 1, maxLevel: 4 },
  { id: 'fire_protection', weight: 5, minLevel: 1, maxLevel: 4 },
  { id: 'projectile_protection', weight: 5, minLevel: 1, maxLevel: 4 },
  { id: 'unbreaking', weight: 5, minLevel: 1, maxLevel: 3 },
  { id: 'sharpness', weight: 10, minLevel: 1, maxLevel: 5 },
  { id: 'fire_aspect', weight: 2, minLevel: 1, maxLevel: 2 },
  { id: 'efficiency', weight: 10, minLevel: 1, maxLevel: 5 },
  { id: 'fortune', weight: 2, minLevel: 1, maxLevel: 3 },
  { id: 'mending', weight: 2, minLevel: 1, maxLevel: 1 },
];

export function pickFromTable(
  rng: () => number,
  filter?: (e: EnchantOdds) => boolean,
): EnchantOdds | undefined {
  const eligible = filter === undefined ? ENCHANT_TABLE : ENCHANT_TABLE.filter(filter);
  const total = eligible.reduce((s, e) => s + e.weight, 0);
  if (total === 0) return undefined;
  let r = rng() * total;
  for (const e of eligible) {
    r -= e.weight;
    if (r < 0) return e;
  }
  return eligible[eligible.length - 1];
}

export function pickLevel(e: EnchantOdds, rng: () => number): number {
  return e.minLevel + Math.floor(rng() * (e.maxLevel - e.minLevel + 1));
}
