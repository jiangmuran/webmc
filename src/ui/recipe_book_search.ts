export interface Recipe {
  resultId: string;
  tags: string[];
  tabs: string[];
}

export type Tab = 'all' | 'equipment' | 'building' | 'misc' | 'food';

export function filterByTab(all: Recipe[], tab: Tab): Recipe[] {
  if (tab === 'all') return all;
  return all.filter((r) => r.tabs.includes(tab));
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const q = query.toLowerCase();
  if (q === '') return recipes;
  return recipes.filter(
    (r) => r.resultId.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
