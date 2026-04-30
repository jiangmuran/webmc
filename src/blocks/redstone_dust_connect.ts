// Redstone dust connection. Dust connects automatically to 4 adjacent
// sides that have a redstone component or an opaque block with dust
// above/below a staircase layout.

export type Side = 'north' | 'south' | 'east' | 'west';

export interface DustQuery {
  neighbor: Record<
    Side,
    {
      hasDust: boolean;
      hasPowerSource: boolean; // repeater/lever/button/observer/etc.
      isOpaqueBlock: boolean;
    }
  >;
  // blocks above and below adjacent position (for stair hops)
  above: Record<Side, { hasDust: boolean; hasOpaqueAbove: boolean }>;
  below: Record<Side, { hasDust: boolean }>;
  selfBlockedByOpaqueAbove: boolean;
}

export type Connection = 'none' | 'side' | 'up' | 'down';

export function connectionFor(s: Side, q: DustQuery): Connection {
  const n = q.neighbor[s];
  if (n.hasDust || n.hasPowerSource) return 'side';
  if (n.isOpaqueBlock && q.above[s].hasDust) return 'up';
  if (!n.isOpaqueBlock && q.below[s].hasDust && !q.selfBlockedByOpaqueAbove) return 'down';
  return 'none';
}

export function allConnections(q: DustQuery): Record<Side, Connection> {
  return {
    north: connectionFor('north', q),
    south: connectionFor('south', q),
    east: connectionFor('east', q),
    west: connectionFor('west', q),
  };
}

// Dust sprite: straight-line if exactly 2 opposite sides connected.
export type DustShape =
  | 'dot'
  | 'ns_line'
  | 'ew_line'
  | 'cross'
  | 'corner_ne'
  | 'corner_nw'
  | 'corner_se'
  | 'corner_sw'
  | 'tshape_n'
  | 'tshape_s'
  | 'tshape_e'
  | 'tshape_w';

// Wiki (minecraft.wiki/w/Redstone_Dust): "When there are no adjacent
// components, a single redstone wire configures itself into a cross
// plus sign, which can provide power in all four directions. By
// right-clicking, it can be changed into a dot, which does not
// provide power to any of the four directions." (Java only.) Old
// code returned 'dot' for the no-neighbor case as the default — the
// inverse of canon. The optional `dottedByPlayer` flag toggles to
// the dot variant.
export function dustShape(conns: Record<Side, Connection>, dottedByPlayer = false): DustShape {
  const n = conns.north !== 'none';
  const s = conns.south !== 'none';
  const e = conns.east !== 'none';
  const w = conns.west !== 'none';
  const count = (n ? 1 : 0) + (s ? 1 : 0) + (e ? 1 : 0) + (w ? 1 : 0);
  if (count === 0) return dottedByPlayer ? 'dot' : 'cross';
  if (n && s && e && w) return 'cross';
  if (count === 2) {
    if (n && s) return 'ns_line';
    if (e && w) return 'ew_line';
    if (n && e) return 'corner_ne';
    if (n && w) return 'corner_nw';
    if (s && e) return 'corner_se';
    if (s && w) return 'corner_sw';
  }
  if (count === 3) {
    if (!n) return 'tshape_s';
    if (!s) return 'tshape_n';
    if (!e) return 'tshape_w';
    return 'tshape_e';
  }
  // count 1 → dust extends across the block to form a line through
  // the connected side and its opposite (per wiki).
  if (n || s) return 'ns_line';
  return 'ew_line';
}
