export interface VaultLootEntry {
  item: string;
  weight: number;
}

export function rollLoot(
  entries: readonly VaultLootEntry[],
  rng: () => number,
): string | undefined {
  if (entries.length === 0) return undefined;
  const total = entries.reduce((s, e) => s + e.weight, 0);
  if (total <= 0) return undefined;
  let r = rng() * total;
  for (const e of entries) {
    r -= e.weight;
    if (r < 0) return e.item;
  }
  return entries[entries.length - 1]?.item;
}
