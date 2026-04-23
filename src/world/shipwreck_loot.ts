// Shipwrecks have 3 loot chests: supply, map, treasure. Each rolls from
// its own table.

export type ShipwreckChestKind = 'supply' | 'map' | 'treasure';

export interface Shipwreck {
  x: number;
  y: number;
  z: number;
  orientation: 'upright' | 'sideways' | 'buried';
  hasSupplyChest: boolean;
  hasMapChest: boolean;
  hasTreasureChest: boolean;
}

export function hasChestsGiven(rand: () => number): {
  supply: boolean;
  map: boolean;
  treasure: boolean;
} {
  return {
    supply: rand() < 0.75,
    map: rand() < 0.6,
    treasure: rand() < 0.5,
  };
}

export function orientationForGround(
  onSand: boolean,
  nearCoast: boolean,
): Shipwreck['orientation'] {
  if (onSand && !nearCoast) return 'buried';
  if (nearCoast) return 'upright';
  return 'sideways';
}
