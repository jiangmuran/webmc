// Iron bars + glass panes connect to adjacent full blocks and same-
// material segments. 4-way visual variants.

export type Side = 'north' | 'south' | 'east' | 'west';

export interface NeighborQuery {
  neighbor: Record<Side, { fullBlock: boolean; sameMaterial: boolean }>;
}

export function connectionsFor(q: NeighborQuery): Set<Side> {
  const out = new Set<Side>();
  for (const s of ['north', 'south', 'east', 'west'] as const) {
    const n = q.neighbor[s];
    if (n.fullBlock || n.sameMaterial) out.add(s);
  }
  return out;
}

export type ShapeKey = 'post' | 'straight_ns' | 'straight_ew' | 'corner' | 'tshape' | 'cross';

export function shapeFor(conn: Set<Side>): ShapeKey {
  const n = conn.has('north');
  const s = conn.has('south');
  const e = conn.has('east');
  const w = conn.has('west');
  const count = (n ? 1 : 0) + (s ? 1 : 0) + (e ? 1 : 0) + (w ? 1 : 0);
  if (count === 0) return 'post';
  if (count === 1) return n || s ? 'straight_ns' : 'straight_ew';
  if (count === 2) {
    if (n && s) return 'straight_ns';
    if (e && w) return 'straight_ew';
    return 'corner';
  }
  if (count === 3) return 'tshape';
  return 'cross';
}
