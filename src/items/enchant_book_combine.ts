export interface BookEnchant {
  id: string;
  level: number;
  maxLevel: number;
}

export function combineBooks(
  a: readonly BookEnchant[],
  b: readonly BookEnchant[],
): readonly BookEnchant[] {
  const out = new Map<string, BookEnchant>();
  for (const e of a) out.set(e.id, { ...e });
  for (const e of b) {
    const existing = out.get(e.id);
    if (existing === undefined) {
      out.set(e.id, { ...e });
    } else if (existing.level === e.level && existing.level < existing.maxLevel) {
      out.set(e.id, { ...existing, level: existing.level + 1 });
    } else if (e.level > existing.level) {
      out.set(e.id, { ...e });
    }
  }
  return [...out.values()];
}

export function xpCost(a: readonly BookEnchant[], b: readonly BookEnchant[]): number {
  let cost = 0;
  for (const e of b) {
    cost += e.level * 2;
  }
  cost += a.length;
  return cost;
}
