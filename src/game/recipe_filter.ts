// Recipe book filter. Filters unlocked recipes by text + category.

export type RecipeCategory = 'building' | 'redstone' | 'equipment' | 'misc' | 'food';

export interface RecipeEntry {
  id: string;
  name: string;
  category: RecipeCategory;
  unlocked: boolean;
}

export interface FilterOptions {
  query: string;
  category: RecipeCategory | 'all';
  showLocked: boolean;
}

export function filter(entries: RecipeEntry[], opts: FilterOptions): RecipeEntry[] {
  const q = opts.query.toLowerCase().trim();
  return entries.filter((e) => {
    if (!opts.showLocked && !e.unlocked) return false;
    if (opts.category !== 'all' && e.category !== opts.category) return false;
    if (q && !e.name.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function sortByName(entries: RecipeEntry[]): RecipeEntry[] {
  return [...entries].sort((a, b) => a.name.localeCompare(b.name));
}
