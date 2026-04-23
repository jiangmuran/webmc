// Creative mode inventory tabs. Groups items by category.

export type CreativeTab =
  | 'building_blocks'
  | 'natural'
  | 'functional'
  | 'redstone'
  | 'tools'
  | 'combat'
  | 'food'
  | 'ingredients'
  | 'spawn_eggs'
  | 'operator'
  | 'search';

export interface CreativeItem {
  id: string;
  tab: CreativeTab;
  order: number;
}

export function tabItems(items: CreativeItem[], tab: CreativeTab): CreativeItem[] {
  return [...items.filter((i) => i.tab === tab)].sort((a, b) => a.order - b.order);
}

export function searchItems(items: CreativeItem[], query: string): CreativeItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return items;
  return items.filter((i) => i.id.toLowerCase().includes(q));
}

export const TABS_ORDER: CreativeTab[] = [
  'building_blocks',
  'natural',
  'functional',
  'redstone',
  'tools',
  'combat',
  'food',
  'ingredients',
  'spawn_eggs',
  'operator',
  'search',
];
