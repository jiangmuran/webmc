// Ancient city chest loot: Enchanted golden apple rare; Swift Sneak book
// unique to here; Echo Shard (for recovery compass).

export type AncientCityLoot =
  | 'enchanted_golden_apple'
  | 'swift_sneak_book'
  | 'echo_shard'
  | 'sculk_catalyst_item'
  | 'music_disc_5'
  | 'music_disc_otherside'
  | 'name_tag'
  | 'disc_fragment_5';

export interface LootWeight {
  id: AncientCityLoot;
  weight: number;
}

export const ANCIENT_CITY_POOL: LootWeight[] = [
  { id: 'enchanted_golden_apple', weight: 2 },
  { id: 'swift_sneak_book', weight: 2 },
  { id: 'echo_shard', weight: 4 },
  { id: 'sculk_catalyst_item', weight: 1 },
  { id: 'music_disc_5', weight: 1 },
  { id: 'music_disc_otherside', weight: 2 },
  { id: 'name_tag', weight: 3 },
  { id: 'disc_fragment_5', weight: 5 },
];

export function pickLoot(rand: () => number): AncientCityLoot {
  const total = ANCIENT_CITY_POOL.reduce((s, e) => s + e.weight, 0);
  let r = rand() * total;
  for (const e of ANCIENT_CITY_POOL) {
    if (r < e.weight) return e.id;
    r -= e.weight;
  }
  return 'name_tag';
}
