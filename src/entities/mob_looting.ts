// Looting enchantment drop modifier. Looting I/II/III add up to 3 rare
// rolls per kill and bump max-count by +level. Only applies when the
// killer wielded a weapon with the enchant.

export interface LootingDrop {
  item: string;
  baseMin: number;
  baseMax: number;
  rare: boolean;
  rareChance: number; // 0..1 base
}

export interface LootingQuery {
  looting: number; // 0..3
  drop: LootingDrop;
  rng: () => number;
}

export function applyLooting(q: LootingQuery): { item: string; count: number } | null {
  const l = Math.max(0, Math.min(3, q.looting));
  if (q.drop.rare) {
    // Rare drops: base + 0.01*level chance, can roll up to l+1 times
    const chance = q.drop.rareChance + 0.01 * l;
    let count = 0;
    const rolls = 1 + l;
    for (let i = 0; i < rolls; i++) {
      if (q.rng() < chance) count++;
    }
    if (count === 0) return null;
    return { item: q.drop.item, count };
  }
  // Normal drops: min + random(max - min + 1 + looting).
  const span = q.drop.baseMax - q.drop.baseMin + 1 + l;
  const rolled = Math.floor(q.rng() * span);
  const count = q.drop.baseMin + rolled;
  if (count <= 0) return null;
  return { item: q.drop.item, count };
}

// Convenience: apply looting to a set of drops and return the combined
// list, filtering out zero/negative counts.
export function applyLootingToAll(
  drops: readonly LootingDrop[],
  looting: number,
  rng: () => number,
): { item: string; count: number }[] {
  const out: { item: string; count: number }[] = [];
  for (const d of drops) {
    const r = applyLooting({ looting, drop: d, rng });
    if (r) out.push(r);
  }
  return out;
}
