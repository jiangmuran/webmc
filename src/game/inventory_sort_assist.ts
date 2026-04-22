// Inventory sort. Groups items by tab category, then within category
// sorts alphabetically by id. Stackable items coalesce. Ctrl-click
// triggers (player option).

export type ItemCategory =
  | 'building_blocks'
  | 'tools'
  | 'weapons'
  | 'food'
  | 'redstone'
  | 'transport'
  | 'misc';

export interface InvItem {
  id: string;
  count: number;
  category: ItemCategory;
  stackMax: number;
}

const CAT_ORDER: ItemCategory[] = [
  'weapons',
  'tools',
  'food',
  'building_blocks',
  'redstone',
  'transport',
  'misc',
];

export function sortInventory(items: (InvItem | null)[]): (InvItem | null)[] {
  const present = items.filter((x): x is InvItem => x !== null);
  // Coalesce same id into largest stacks up to stackMax.
  const groups = new Map<string, InvItem[]>();
  for (const it of present) {
    const list = groups.get(it.id) ?? [];
    list.push({ ...it });
    groups.set(it.id, list);
  }
  const merged: InvItem[] = [];
  for (const list of groups.values()) {
    const first = list[0];
    if (!first) continue;
    let total = list.reduce((s, i) => s + i.count, 0);
    const stackMax = first.stackMax;
    while (total > 0) {
      const c = Math.min(stackMax, total);
      merged.push({ id: first.id, count: c, category: first.category, stackMax });
      total -= c;
    }
  }
  merged.sort((a, b) => {
    const ca = CAT_ORDER.indexOf(a.category);
    const cb = CAT_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  const out: (InvItem | null)[] = items.map(() => null);
  for (let i = 0; i < merged.length && i < out.length; i++) out[i] = merged[i] ?? null;
  return out;
}
