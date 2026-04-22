// Thin block connection. Panes, iron bars, fences, and walls connect
// horizontally to adjacent solid-faced blocks + to each other. Connection
// state is a 4-bit mask (N/S/E/W). Walls also track a "up post" flag.

export const CONN_NORTH = 1 << 0;
export const CONN_SOUTH = 1 << 1;
export const CONN_EAST = 1 << 2;
export const CONN_WEST = 1 << 3;

export interface ConnectionLookup {
  isSolid: (dx: number, dy: number, dz: number) => boolean;
  isSameKind: (dx: number, dy: number, dz: number) => boolean;
  isPane: (dx: number, dy: number, dz: number) => boolean;
}

export function computePaneConnections(lookup: ConnectionLookup): number {
  const deltas: { dir: number; x: number; z: number }[] = [
    { dir: CONN_NORTH, x: 0, z: -1 },
    { dir: CONN_SOUTH, x: 0, z: 1 },
    { dir: CONN_EAST, x: 1, z: 0 },
    { dir: CONN_WEST, x: -1, z: 0 },
  ];
  let mask = 0;
  for (const d of deltas) {
    if (
      lookup.isSameKind(d.x, 0, d.z) ||
      lookup.isPane(d.x, 0, d.z) ||
      lookup.isSolid(d.x, 0, d.z)
    ) {
      mask |= d.dir;
    }
  }
  return mask;
}

// For walls, a "post" is rendered at y+1 if wall exists above OR no
// horizontal connection exists (forces vertical tall post).
export interface WallState {
  connections: number;
  postUp: boolean;
}

export function computeWallState(lookup: ConnectionLookup, hasBlockAbove: boolean): WallState {
  const connections = computePaneConnections(lookup);
  const hasConnections = connections !== 0;
  return {
    connections,
    postUp: hasBlockAbove || !hasConnections,
  };
}

// Glass pane rendering helper: given the connection mask, return whether
// the pane renders straight (2-connection collinear) or crossed.
export function isStraightPane(mask: number): boolean {
  const nsMask = CONN_NORTH | CONN_SOUTH;
  const ewMask = CONN_EAST | CONN_WEST;
  if ((mask & nsMask) === nsMask && (mask & ewMask) === 0) return true;
  if ((mask & ewMask) === ewMask && (mask & nsMask) === 0) return true;
  return false;
}
