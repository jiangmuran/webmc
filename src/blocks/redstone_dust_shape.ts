export type Connection = 'none' | 'side' | 'up';

export interface DustConnections {
  north: Connection;
  south: Connection;
  east: Connection;
  west: Connection;
}

export function dustShape(c: DustConnections): 'dot' | 'line_ns' | 'line_ew' | 'cross' | 'elbow' {
  const ns = c.north !== 'none' || c.south !== 'none';
  const ew = c.east !== 'none' || c.west !== 'none';
  const count =
    (c.north !== 'none' ? 1 : 0) +
    (c.south !== 'none' ? 1 : 0) +
    (c.east !== 'none' ? 1 : 0) +
    (c.west !== 'none' ? 1 : 0);
  if (count === 0) return 'dot';
  if (ns && !ew) return 'line_ns';
  if (ew && !ns) return 'line_ew';
  if (count === 4) return 'cross';
  return 'elbow';
}

export function hasUpward(c: DustConnections): boolean {
  return c.north === 'up' || c.south === 'up' || c.east === 'up' || c.west === 'up';
}
