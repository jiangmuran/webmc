// Grindstone. Combines two damaged tools of the same type into a
// single repaired tool, also removes non-curse enchantments. 5% XP
// drop per enchant removed.

export interface ToolItem {
  id: string;
  damage: number;
  maxDurability: number;
  enchantments: { id: string; level: number }[];
}

const CURSES = new Set<string>(['webmc:binding_curse', 'webmc:vanishing_curse']);

export interface CombineQuery {
  a: ToolItem | null;
  b: ToolItem | null;
}

export interface CombineResult {
  output: ToolItem | null;
  xpDropped: number;
}

function removeEnchants(t: ToolItem): CombineResult {
  const kept = t.enchantments.filter((e) => CURSES.has(e.id));
  const removed = t.enchantments.length - kept.length;
  return {
    output: { ...t, enchantments: kept },
    xpDropped: removed,
  };
}

export function combine(q: CombineQuery): CombineResult {
  const { a, b } = q;
  if (!a && !b) return { output: null, xpDropped: 0 };
  if (a && !b) return removeEnchants(a);
  if (b && !a) return removeEnchants(b);
  if (!a || !b) return { output: null, xpDropped: 0 };
  if (a.id !== b.id) return { output: null, xpDropped: 0 };
  const durLeft = Math.max(0, a.maxDurability - a.damage) + Math.max(0, b.maxDurability - b.damage);
  const bonus = Math.floor(a.maxDurability * 0.05);
  const repaired = Math.min(a.maxDurability, durLeft + bonus);
  const all = [...a.enchantments, ...b.enchantments];
  const kept = all.filter((e) => CURSES.has(e.id));
  const removed = all.length - kept.length;
  const output: ToolItem = {
    id: a.id,
    maxDurability: a.maxDurability,
    damage: a.maxDurability - repaired,
    enchantments: kept,
  };
  return { output, xpDropped: removed };
}
