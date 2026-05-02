export type Connection = 'none' | 'side' | 'up';

export interface DustConnections {
  north: Connection;
  south: Connection;
  east: Connection;
  west: Connection;
  // Wiki: an isolated wire defaults to a + cross, but right-clicking
  // toggles it to a dot (which doesn't power any of the 4 sides).
  dottedByPlayer?: boolean;
}

// Wiki (minecraft.wiki/w/Redstone_Dust): "When there are no adjacent
// components, a single redstone wire configures itself into a cross
// plus sign, which can provide power in all four directions. By
// right-clicking, it can be changed into a dot, which does not
// provide power to any of the four directions." (Java only.) Old
// code returned 'dot' for the isolated case as the default — that
// was the inverse of canon and silently broke isolated-dust power.
export function dustShape(c: DustConnections): 'dot' | 'line_ns' | 'line_ew' | 'cross' | 'elbow' {
  const ns = c.north !== 'none' || c.south !== 'none';
  const ew = c.east !== 'none' || c.west !== 'none';
  const count =
    (c.north !== 'none' ? 1 : 0) +
    (c.south !== 'none' ? 1 : 0) +
    (c.east !== 'none' ? 1 : 0) +
    (c.west !== 'none' ? 1 : 0);
  if (count === 0) return c.dottedByPlayer === true ? 'dot' : 'cross';
  if (ns && !ew) return 'line_ns';
  if (ew && !ns) return 'line_ew';
  if (count === 4) return 'cross';
  return 'elbow';
}

export function hasUpward(c: DustConnections): boolean {
  return c.north === 'up' || c.south === 'up' || c.east === 'up' || c.west === 'up';
}
