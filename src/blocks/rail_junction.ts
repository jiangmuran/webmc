// Rail junction choice. Curved rail at a T-junction picks the direction
// based on powered neighbors / north-then-east convention.

export type RailShape =
  | 'east_west'
  | 'north_south'
  | 'ascending_east'
  | 'ascending_west'
  | 'ascending_north'
  | 'ascending_south'
  | 'south_east'
  | 'south_west'
  | 'north_west'
  | 'north_east';

export interface Neighbors {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export function autoShape(n: Neighbors): RailShape {
  const count = Number(n.north) + Number(n.south) + Number(n.east) + Number(n.west);
  if (count <= 1) {
    if (n.north || n.south) return 'north_south';
    return 'east_west';
  }
  if (n.north && n.south) return 'north_south';
  if (n.east && n.west) return 'east_west';
  if (n.north && n.east) return 'north_east';
  if (n.north && n.west) return 'north_west';
  if (n.south && n.east) return 'south_east';
  return 'south_west';
}

export function isCurve(s: RailShape): boolean {
  return s === 'south_east' || s === 'south_west' || s === 'north_east' || s === 'north_west';
}
