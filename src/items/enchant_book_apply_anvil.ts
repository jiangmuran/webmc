export interface ApplyCtx {
  bookEnchants: { id: string; level: number }[];
  targetCompatible: Set<string>;
  targetExisting: Record<string, number>;
  maxLevelCaps: Record<string, number>;
}

export interface ApplyResult {
  enchants: Record<string, number>;
  xpCost: number;
}

export function apply(c: ApplyCtx): ApplyResult {
  const result = { ...c.targetExisting };
  let xpCost = 0;
  for (const { id, level } of c.bookEnchants) {
    if (!c.targetCompatible.has(id)) continue;
    const cap = c.maxLevelCaps[id] ?? level;
    const current = result[id] ?? 0;
    const next = current === level ? Math.min(cap, current + 1) : Math.max(current, level);
    result[id] = Math.min(cap, next);
    xpCost += next;
  }
  return { enchants: result, xpCost };
}
