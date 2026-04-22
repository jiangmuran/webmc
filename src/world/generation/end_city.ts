// End city. Large purpur-block structure on outer end islands. Composed
// of towers, bridges, and a treasury room. 50% chance of an end ship with
// an elytra and dragon head attached. Shulkers spawn inside.

export type EndCityPiece =
  | 'tower_base'
  | 'tower_segment'
  | 'tower_top'
  | 'bridge'
  | 'treasury'
  | 'ship';

export interface EndCityLayout {
  pieces: readonly EndCityPiece[];
  hasShip: boolean;
  shulkerCount: number;
  chests: number;
  elytraSlot: boolean;
}

export interface EndCityQuery {
  rng: () => number;
  towerHeight: number; // 1..6 segments
}

export function planEndCity(q: EndCityQuery): EndCityLayout {
  const pieces: EndCityPiece[] = ['tower_base'];
  for (let i = 0; i < q.towerHeight; i++) pieces.push('tower_segment');
  pieces.push('tower_top');
  const hasBridge = q.rng() < 0.6;
  if (hasBridge) pieces.push('bridge', 'treasury');
  const hasShip = q.rng() < 0.5;
  if (hasShip) pieces.push('ship');
  return {
    pieces,
    hasShip,
    shulkerCount: 2 + q.towerHeight + (hasShip ? 2 : 0),
    chests: (hasBridge ? 1 : 0) + (hasShip ? 1 : 0),
    elytraSlot: hasShip,
  };
}

export interface EndCityLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

export const END_CITY_LOOT: readonly EndCityLootEntry[] = [
  { item: 'webmc:diamond_pickaxe', weight: 3, min: 1, max: 1 },
  { item: 'webmc:diamond_sword', weight: 3, min: 1, max: 1 },
  { item: 'webmc:iron_ingot', weight: 10, min: 1, max: 4 },
  { item: 'webmc:gold_ingot', weight: 10, min: 2, max: 7 },
  { item: 'webmc:diamond', weight: 5, min: 1, max: 3 },
  { item: 'webmc:emerald', weight: 5, min: 2, max: 6 },
  { item: 'webmc:saddle', weight: 3, min: 1, max: 1 },
  { item: 'webmc:horse_armor_iron', weight: 1, min: 1, max: 1 },
  { item: 'webmc:horse_armor_gold', weight: 1, min: 1, max: 1 },
  { item: 'webmc:horse_armor_diamond', weight: 1, min: 1, max: 1 },
  { item: 'webmc:enchanted_book', weight: 1, min: 1, max: 1 },
  { item: 'webmc:beetroot_seeds', weight: 10, min: 1, max: 10 },
];

export function rollEndCityLoot(roll: number): EndCityLootEntry | null {
  const total = END_CITY_LOOT.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of END_CITY_LOOT) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return END_CITY_LOOT[END_CITY_LOOT.length - 1] ?? null;
}
