export interface LootEntry {
  item: string;
  weight: number;
  countMin: number;
  countMax: number;
}

export function pickOne(entries: LootEntry[], rng: () => number): LootEntry | undefined {
  const total = entries.reduce((a, b) => a + b.weight, 0);
  if (total <= 0) return undefined;
  let pick = rng() * total;
  for (const e of entries) {
    pick -= e.weight;
    if (pick <= 0) return e;
  }
  return entries[entries.length - 1];
}

export function rollCount(e: LootEntry, rng: () => number): number {
  if (e.countMax <= e.countMin) return e.countMin;
  return e.countMin + Math.floor(rng() * (e.countMax - e.countMin + 1));
}
