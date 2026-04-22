// Rail shape detection. A rail picks one of 10 shapes based on its
// neighbors: 4 straight, 4 curves (for regular rails only), and 2
// ascending slopes. Activator / detector / powered rails only support
// the 6 straight + ascending shapes (no curves).

export type RailShape =
  | 'north_south'
  | 'east_west'
  | 'ascending_north'
  | 'ascending_south'
  | 'ascending_east'
  | 'ascending_west'
  | 'south_east'
  | 'south_west'
  | 'north_east'
  | 'north_west';

export type RailKind = 'rail' | 'powered_rail' | 'detector_rail' | 'activator_rail';

export interface RailNeighborQuery {
  kind: RailKind;
  north: boolean; // is there a rail neighbor to the north?
  south: boolean;
  east: boolean;
  west: boolean;
  northHigher: boolean; // northern neighbor is 1 block up (for slope)
  southHigher: boolean;
  eastHigher: boolean;
  westHigher: boolean;
}

export function computeRailShape(q: RailNeighborQuery): RailShape {
  // Ascending slopes take priority.
  if (q.northHigher) return 'ascending_north';
  if (q.southHigher) return 'ascending_south';
  if (q.eastHigher) return 'ascending_east';
  if (q.westHigher) return 'ascending_west';

  const ns = q.north && q.south;
  const ew = q.east && q.west;

  // Curves only on regular rail.
  if (q.kind === 'rail') {
    if (q.south && q.east && !q.north && !q.west) return 'south_east';
    if (q.south && q.west && !q.north && !q.east) return 'south_west';
    if (q.north && q.east && !q.south && !q.west) return 'north_east';
    if (q.north && q.west && !q.south && !q.east) return 'north_west';
  }

  if (ns || q.north || q.south) return 'north_south';
  if (ew || q.east || q.west) return 'east_west';
  return 'north_south';
}

// Powered rail propagation. A powered rail lit by redstone propagates
// its "energized" state to adjacent powered rails up to 8 blocks.
export const POWERED_RAIL_PROPAGATION_LIMIT = 8;

export interface PowerChainQuery {
  direct: boolean; // powered by redstone directly adjacent
  prevEnergized: boolean;
  chainDistance: number; // how far this rail is from a direct power source
}

export function poweredRailEnergized(q: PowerChainQuery): boolean {
  if (q.direct) return true;
  if (q.prevEnergized && q.chainDistance < POWERED_RAIL_PROPAGATION_LIMIT) return true;
  return false;
}

// Activator rails: on power, trigger entity actions (eject from
// minecart, detonate TNT carts). Rails are otherwise inert.
export interface ActivatorEffect {
  ejectRiders: boolean;
  detonateTntCart: boolean;
  spawnSpawner: boolean;
}

export function activatorEffect(powered: boolean): ActivatorEffect {
  return {
    ejectRiders: powered,
    detonateTntCart: powered,
    spawnSpawner: powered,
  };
}
