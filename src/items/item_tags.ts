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

// Wiki-aligned defaults for several common item tags. Old seeds were
// stub-sized (3 wool colors out of 16, 4 piglin-loved items out of
// ~25, 4 creeper-drop discs out of 12). Sibling
// entities/piglin_gold_priority.ts already has the canonical
// gold-item list; aligning the tag here.
export function seedDefaultItemTags(r: ItemTagRegistry): void {
  addTag(r, 'fishes', ['cod', 'salmon', 'tropical_fish', 'pufferfish']);
  addTag(r, 'wool', [
    'white_wool',
    'orange_wool',
    'magenta_wool',
    'light_blue_wool',
    'yellow_wool',
    'lime_wool',
    'pink_wool',
    'gray_wool',
    'light_gray_wool',
    'cyan_wool',
    'purple_wool',
    'blue_wool',
    'brown_wool',
    'green_wool',
    'red_wool',
    'black_wool',
  ]);
  // Wiki (minecraft.wiki/w/Piglin#Items_piglins_are_attracted_to):
  // gold-themed items that piglins look at, pick up, or barter.
  addTag(r, 'piglin_loved', [
    'gold_ingot',
    'gold_block',
    'gold_nugget',
    'raw_gold',
    'raw_gold_block',
    'gilded_blackstone',
    'nether_gold_ore',
    'gold_ore',
    'deepslate_gold_ore',
    'golden_apple',
    'enchanted_golden_apple',
    'golden_carrot',
    'glistering_melon_slice',
    'golden_sword',
    'golden_pickaxe',
    'golden_axe',
    'golden_shovel',
    'golden_hoe',
    'gold_sword',
    'gold_pickaxe',
    'gold_axe',
    'gold_shovel',
    'gold_hoe',
    'golden_helmet',
    'golden_chestplate',
    'golden_leggings',
    'golden_boots',
    'gold_helmet',
    'gold_chestplate',
    'gold_leggings',
    'gold_boots',
    'golden_horse_armor',
    'clock',
    'light_weighted_pressure_plate',
    'bell',
    'powered_rail',
  ]);
  // Wiki (minecraft.wiki/w/Music_Disc): when a creeper is killed by a
  // skeleton's arrow it drops one of the 12 "skeleton-droppable" discs.
  addTag(r, 'creeper_drop_music_discs', [
    'music_disc_13',
    'music_disc_cat',
    'music_disc_blocks',
    'music_disc_chirp',
    'music_disc_far',
    'music_disc_mall',
    'music_disc_mellohi',
    'music_disc_stal',
    'music_disc_strad',
    'music_disc_ward',
    'music_disc_11',
    'music_disc_wait',
  ]);
  addTag(r, 'axolotl_tempt_items', ['bucket_of_tropical_fish']);
  addTag(r, 'arrows', ['arrow', 'tipped_arrow', 'spectral_arrow']);
}
