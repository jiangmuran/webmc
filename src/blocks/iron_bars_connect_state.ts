export interface BarsNeighbors {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export function connectionCount(n: BarsNeighbors): number {
  return Number(n.north) + Number(n.south) + Number(n.east) + Number(n.west);
}

export function isFloater(n: BarsNeighbors): boolean {
  return connectionCount(n) === 0;
}

export function renderModel(n: BarsNeighbors): string {
  if (isFloater(n)) return 'post';
  return 'connected';
}
