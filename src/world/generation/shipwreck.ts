// Shipwrecks. Appear in oceans (and occasionally on land, partially buried
// beaches). 20 variants — 4 ship classes × 5 orientations. Each has up to
// 3 chests (map, treasure, supply) drawn from loot pools.

export type ShipwreckClass = 'full' | 'with_mast' | 'sideways' | 'half_sinking';
export type ShipwreckChest = 'map' | 'treasure' | 'supply';

export interface ShipwreckLayout {
  klass: ShipwreckClass;
  tiltDegrees: number;
  hasMast: boolean;
  chestSlots: readonly ShipwreckChest[];
}

export interface ShipwreckQuery {
  rng: () => number;
}

export function planShipwreck(q: ShipwreckQuery): ShipwreckLayout {
  const classRoll = q.rng();
  const klass: ShipwreckClass =
    classRoll < 0.3
      ? 'full'
      : classRoll < 0.55
        ? 'with_mast'
        : classRoll < 0.8
          ? 'half_sinking'
          : 'sideways';
  const tilt = klass === 'sideways' ? 90 : klass === 'half_sinking' ? 25 : 0;
  const chestSlots: ShipwreckChest[] = [];
  if (q.rng() < 0.8) chestSlots.push('map');
  if (q.rng() < 0.7) chestSlots.push('treasure');
  if (q.rng() < 0.7) chestSlots.push('supply');
  return {
    klass,
    tiltDegrees: tilt,
    hasMast: klass === 'with_mast',
    chestSlots,
  };
}

export type MapLoot = 'map_buried_treasure' | 'paper' | 'feather' | 'book';
export type TreasureLoot =
  | 'emerald'
  | 'iron_ingot'
  | 'gold_ingot'
  | 'lapis'
  | 'diamond'
  | 'experience_bottle';
// Wiki (minecraft.wiki/w/Shipwreck#Loot) Supply chest pool — Java
// uses leather_helmet (the Bedrock name 'leather_cap' doesn't exist
// as an item ID). Same naming fix as buried_treasure / ocean_ruin.
export type SupplyLoot =
  | 'suspicious_stew'
  | 'wheat'
  | 'carrot'
  | 'potato'
  | 'rotten_flesh'
  | 'leather_helmet'
  | 'tnt'
  | 'gunpowder';

const MAP_POOL: readonly { item: MapLoot; weight: number }[] = [
  { item: 'map_buried_treasure', weight: 1 },
  { item: 'paper', weight: 20 },
  { item: 'feather', weight: 10 },
  { item: 'book', weight: 5 },
];

const TREASURE_POOL: readonly { item: TreasureLoot; weight: number }[] = [
  { item: 'iron_ingot', weight: 90 },
  { item: 'gold_ingot', weight: 10 },
  { item: 'emerald', weight: 40 },
  { item: 'lapis', weight: 20 },
  { item: 'diamond', weight: 5 },
  { item: 'experience_bottle', weight: 5 },
];

const SUPPLY_POOL: readonly { item: SupplyLoot; weight: number }[] = [
  { item: 'suspicious_stew', weight: 10 },
  { item: 'wheat', weight: 20 },
  { item: 'carrot', weight: 15 },
  { item: 'potato', weight: 15 },
  { item: 'rotten_flesh', weight: 10 },
  { item: 'leather_helmet', weight: 5 },
  { item: 'tnt', weight: 5 },
  { item: 'gunpowder', weight: 5 },
];

export function rollShipwreckLoot(
  chest: ShipwreckChest,
  roll: number,
): MapLoot | TreasureLoot | SupplyLoot {
  const pool = chest === 'map' ? MAP_POOL : chest === 'treasure' ? TREASURE_POOL : SUPPLY_POOL;
  const total = pool.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of pool) {
    acc += e.weight;
    if (target < acc) return e.item;
  }
  return pool[pool.length - 1]?.item ?? 'paper';
}
