// Ancient city chest loot (1.19). Two main tables: "ancient_city" for the
// reward rooms and "ancient_city_ice_box" for the ice-box rooms. Both have
// echo shards and disc fragments as signatures.

export interface AncientCityLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

export type AncientCityTable = 'ancient_city' | 'ancient_city_ice_box';

export const ANCIENT_CITY_LOOT: Record<AncientCityTable, readonly AncientCityLootEntry[]> = {
  ancient_city: [
    { item: 'webmc:echo_shard', weight: 30, min: 1, max: 3 },
    { item: 'webmc:music_disc_5', weight: 4, min: 1, max: 1 },
    { item: 'webmc:music_disc_otherside', weight: 3, min: 1, max: 1 },
    { item: 'webmc:disc_fragment_5', weight: 12, min: 1, max: 2 },
    { item: 'webmc:enchanted_book', weight: 10, min: 1, max: 1 },
    { item: 'webmc:name_tag', weight: 25, min: 1, max: 1 },
    { item: 'webmc:diamond_horse_armor', weight: 3, min: 1, max: 1 },
    { item: 'webmc:ward_armor_trim', weight: 6, min: 1, max: 1 },
    { item: 'webmc:silence_armor_trim', weight: 2, min: 1, max: 1 },
    { item: 'webmc:compass', weight: 15, min: 1, max: 1 },
    { item: 'webmc:lead', weight: 15, min: 1, max: 1 },
    { item: 'webmc:saddle', weight: 15, min: 1, max: 1 },
    { item: 'webmc:candle', weight: 10, min: 1, max: 5 },
    { item: 'webmc:bone', weight: 20, min: 3, max: 8 },
    { item: 'webmc:soul_torch', weight: 10, min: 2, max: 4 },
  ],
  ancient_city_ice_box: [
    { item: 'webmc:snowball', weight: 40, min: 1, max: 16 },
    { item: 'webmc:packed_ice', weight: 30, min: 1, max: 3 },
  ],
};

export function ancientCityRoll(
  table: AncientCityTable,
  roll: number,
): AncientCityLootEntry | null {
  const entries = ANCIENT_CITY_LOOT[table];
  if (entries.length === 0) return null;
  const total = entries.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of entries) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return entries[entries.length - 1] ?? null;
}
