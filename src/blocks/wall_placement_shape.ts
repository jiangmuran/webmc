export type WallConnection = 'none' | 'low' | 'tall';

export interface WallState {
  up: boolean;
  north: WallConnection;
  south: WallConnection;
  east: WallConnection;
  west: WallConnection;
  waterlogged: boolean;
}

export function computeUpPost(s: Omit<WallState, 'up' | 'waterlogged'>): boolean {
  const connections = [s.north, s.south, s.east, s.west];
  const activeCount = connections.filter((c) => c !== 'none').length;
  if (activeCount === 0) return true;
  if (activeCount === 2) {
    const ns = s.north !== 'none' && s.south !== 'none';
    const ew = s.east !== 'none' && s.west !== 'none';
    if (ns && !ew) return false;
    if (ew && !ns) return false;
    return true;
  }
  return true;
}

export function updateConnections(
  neighbors: Readonly<Record<'north' | 'south' | 'east' | 'west', boolean>>,
): Pick<WallState, 'north' | 'south' | 'east' | 'west'> {
  return {
    north: neighbors.north ? 'low' : 'none',
    south: neighbors.south ? 'low' : 'none',
    east: neighbors.east ? 'low' : 'none',
    west: neighbors.west ? 'low' : 'none',
  };
}
