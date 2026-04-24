export interface Binding {
  action: string;
  key: string;
  category: 'movement' | 'combat' | 'inventory' | 'chat' | 'misc';
}

export function findConflicts(
  bindings: readonly Binding[],
): readonly { key: string; actions: readonly string[] }[] {
  const groups = new Map<string, string[]>();
  for (const b of bindings) {
    const list = groups.get(b.key) ?? [];
    list.push(b.action);
    groups.set(b.key, list);
  }
  const conflicts: { key: string; actions: readonly string[] }[] = [];
  for (const [key, actions] of groups.entries()) {
    if (actions.length > 1) conflicts.push({ key, actions });
  }
  return conflicts;
}

export function crossCategoryConflict(bindings: readonly Binding[]): boolean {
  const byKey = new Map<string, Set<string>>();
  for (const b of bindings) {
    const s = byKey.get(b.key) ?? new Set();
    s.add(b.category);
    byKey.set(b.key, s);
  }
  for (const categories of byKey.values()) {
    if (categories.size > 1) return true;
  }
  return false;
}
