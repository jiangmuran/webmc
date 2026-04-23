export interface LootEntry {
  id: string;
  weight: number;
  min?: number;
  max?: number;
  conditions?: readonly string[];
}

export interface LootContext {
  lootingLevel: number;
  fortuneLevel: number;
  flags: ReadonlySet<string>;
}

export function rollLoot(
  entries: readonly LootEntry[],
  rng: () => number,
  ctx: LootContext,
): { id: string; count: number }[] {
  const matching = entries.filter(
    (e) => e.conditions === undefined || e.conditions.every((c) => ctx.flags.has(c)),
  );
  if (matching.length === 0) return [];
  const total = matching.reduce((s, e) => s + e.weight, 0);
  const pickRolls = 1 + Math.floor(ctx.lootingLevel * rng());
  const out: { id: string; count: number }[] = [];
  for (let i = 0; i < pickRolls; i++) {
    let r = rng() * total;
    for (const e of matching) {
      r -= e.weight;
      if (r < 0) {
        const lo = e.min ?? 1;
        const hi = e.max ?? lo;
        const count = lo + Math.floor(rng() * (hi - lo + 1));
        const bonus = ctx.fortuneLevel > 0 ? Math.floor(rng() * (ctx.fortuneLevel + 1)) : 0;
        out.push({ id: e.id, count: count + bonus });
        break;
      }
    }
  }
  return out;
}
