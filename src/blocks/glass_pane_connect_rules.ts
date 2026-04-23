export interface PaneNeighbors {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export function connectionCount(n: PaneNeighbors): number {
  return Number(n.north) + Number(n.south) + Number(n.east) + Number(n.west);
}

export function isCross(n: PaneNeighbors): boolean {
  return connectionCount(n) === 4;
}

export function isStraight(n: PaneNeighbors): boolean {
  const c = connectionCount(n);
  if (c !== 2) return false;
  return (n.north && n.south) || (n.east && n.west);
}

export function alwaysRendersAsPillar(n: PaneNeighbors): boolean {
  return connectionCount(n) === 0;
}
