// Block tag registry. Tags are flat name sets; queries ignore unknowns.

export interface TagRegistry {
  tags: Record<string, Set<string>>;
}

export function makeRegistry(): TagRegistry {
  return { tags: {} };
}

export function registerTag(r: TagRegistry, tag: string, ids: string[]): void {
  const existing = r.tags[tag] ?? new Set<string>();
  for (const id of ids) existing.add(id);
  r.tags[tag] = existing;
}

export function hasTag(r: TagRegistry, id: string, tag: string): boolean {
  return r.tags[tag]?.has(id) ?? false;
}

export function idsIn(r: TagRegistry, tag: string): string[] {
  return [...(r.tags[tag] ?? [])];
}

export function tagsFor(r: TagRegistry, id: string): string[] {
  return Object.keys(r.tags).filter((t) => r.tags[t]?.has(id));
}

// Built-in block tags (subset).
export function seedDefaults(r: TagRegistry): void {
  registerTag(r, 'logs', [
    'oak_log',
    'spruce_log',
    'birch_log',
    'jungle_log',
    'acacia_log',
    'dark_oak_log',
    'mangrove_log',
    'cherry_log',
  ]);
  registerTag(r, 'planks', ['oak_planks', 'spruce_planks', 'birch_planks']);
  registerTag(r, 'leaves', ['oak_leaves', 'spruce_leaves', 'birch_leaves']);
  registerTag(r, 'sand', ['sand', 'red_sand']);
  registerTag(r, 'dirt', [
    'dirt',
    'grass_block',
    'podzol',
    'mycelium',
    'coarse_dirt',
    'rooted_dirt',
  ]);
  registerTag(r, 'ice', ['ice', 'packed_ice', 'blue_ice', 'frosted_ice']);
  registerTag(r, 'stone_ore_replaceables', ['stone', 'granite', 'andesite', 'diorite']);
}
