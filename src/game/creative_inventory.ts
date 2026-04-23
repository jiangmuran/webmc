export type Tab =
  | 'building_blocks'
  | 'colored_blocks'
  | 'natural'
  | 'functional'
  | 'redstone'
  | 'tools_utilities'
  | 'combat'
  | 'food_drinks'
  | 'ingredients'
  | 'spawn_eggs'
  | 'operator'
  | 'search'
  | 'saved_hotbars';

export interface Entry {
  id: string;
  tab: Tab;
}

export function entriesForTab(all: Entry[], t: Tab): Entry[] {
  if (t === 'search') return all;
  return all.filter((e) => e.tab === t);
}

export function searchMatches(all: Entry[], query: string): Entry[] {
  const q = query.toLowerCase();
  return all.filter((e) => e.id.toLowerCase().includes(q));
}

export const HOTBAR_PRESETS = 9;
