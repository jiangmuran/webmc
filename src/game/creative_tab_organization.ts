export type CreativeTab =
  | 'building_blocks'
  | 'colored_blocks'
  | 'natural_blocks'
  | 'functional_blocks'
  | 'redstone'
  | 'tools_and_utilities'
  | 'combat'
  | 'food_and_drinks'
  | 'ingredients'
  | 'spawn_eggs'
  | 'operator_utilities'
  | 'search';

export interface Entry {
  id: string;
  tab: CreativeTab;
  order: number;
}

export function itemsInTab(all: readonly Entry[], tab: CreativeTab): readonly Entry[] {
  return [...all].filter((e) => e.tab === tab).sort((a, b) => a.order - b.order);
}

export function searchMatches(all: readonly Entry[], query: string): readonly Entry[] {
  const q = query.toLowerCase();
  if (q === '') return [];
  return all.filter((e) => e.id.toLowerCase().includes(q));
}
