// Item tag registry. Similar to block tags but for item-slot checks.

export interface ItemTagRegistry {
  tags: Record<string, Set<string>>;
}

export function makeItemTags(): ItemTagRegistry {
  return { tags: {} };
}

export function addTag(r: ItemTagRegistry, tag: string, ids: string[]): void {
  const existing = r.tags[tag] ?? new Set<string>();
  for (const id of ids) existing.add(id);
  r.tags[tag] = existing;
}

export function inTag(r: ItemTagRegistry, id: string, tag: string): boolean {
  return r.tags[tag]?.has(id) ?? false;
}

export function seedDefaultItemTags(r: ItemTagRegistry): void {
  addTag(r, 'fishes', ['cod', 'salmon', 'tropical_fish', 'pufferfish']);
  addTag(r, 'wool', ['white_wool', 'orange_wool', 'magenta_wool']);
  addTag(r, 'piglin_loved', ['gold_ingot', 'golden_apple', 'golden_sword', 'gilded_blackstone']);
  addTag(r, 'creeper_drop_music_discs', [
    'music_disc_13',
    'music_disc_cat',
    'music_disc_blocks',
    'music_disc_chirp',
  ]);
  addTag(r, 'axolotl_tempt_items', ['bucket_of_tropical_fish']);
  addTag(r, 'arrows', ['arrow', 'tipped_arrow', 'spectral_arrow']);
}
