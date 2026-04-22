// Anvil rename + repair + enchant combine. Costs XP levels based on
// complexity. "Too expensive" at ≥40 levels in survival.

export interface AnvilItem {
  id: string;
  damage: number;
  maxDurability: number;
  name: string | null;
  enchantments: { id: string; level: number }[];
  priorWorkCost: number; // accumulates with each anvil op
}

export interface AnvilQuery {
  left: AnvilItem;
  right: AnvilItem | { kind: 'rename_only'; newName: string } | null;
  playerLevel: number;
  inCreative: boolean;
}

export interface AnvilResult {
  outputItem: AnvilItem | null;
  xpCost: number;
  tooExpensive: boolean;
}

export const TOO_EXPENSIVE_THRESHOLD = 40;

export function anvil(q: AnvilQuery): AnvilResult {
  if (!q.right) return { outputItem: null, xpCost: 0, tooExpensive: false };
  let cost = q.left.priorWorkCost;
  const newItem: AnvilItem = {
    ...q.left,
    enchantments: [...q.left.enchantments],
    priorWorkCost: q.left.priorWorkCost + 1,
  };

  if ('kind' in q.right) {
    if (q.right.newName === q.left.name) {
      return { outputItem: null, xpCost: 0, tooExpensive: false };
    }
    newItem.name = q.right.newName;
    cost += 1;
  } else if ('id' in q.right) {
    const right = q.right;
    // Repair: if same id, restore damage.
    if (right.id === q.left.id && q.left.damage > 0) {
      const repaired = Math.min(q.left.damage, q.left.maxDurability / 4);
      newItem.damage = Math.max(0, q.left.damage - repaired);
      cost += 2;
    }
    // Merge enchantments: right's enchantments are added (take higher).
    for (const e of right.enchantments) {
      const existing = newItem.enchantments.find((x) => x.id === e.id);
      if (existing) existing.level = Math.max(existing.level, e.level);
      else newItem.enchantments.push({ ...e });
      cost += e.level;
    }
    cost += right.priorWorkCost;
  }

  if (!q.inCreative && cost >= TOO_EXPENSIVE_THRESHOLD) {
    return { outputItem: null, xpCost: cost, tooExpensive: true };
  }
  if (!q.inCreative && q.playerLevel < cost) {
    return { outputItem: null, xpCost: cost, tooExpensive: false };
  }
  return { outputItem: newItem, xpCost: cost, tooExpensive: false };
}
