// Piston push/pull logic. Given a solid-block sampler, a max push count (12 in MC),
// and a list of "immovable" predicates (obsidian, bedrock, block entities we can't
// push), return the list of positions that should move + the direction.
// Caller applies the shift atomically.

export type Facing = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function facingDelta(f: Facing): Vec3 {
  switch (f) {
    case 'up':
      return { x: 0, y: 1, z: 0 };
    case 'down':
      return { x: 0, y: -1, z: 0 };
    case 'north':
      return { x: 0, y: 0, z: -1 };
    case 'south':
      return { x: 0, y: 0, z: 1 };
    case 'east':
      return { x: 1, y: 0, z: 0 };
    case 'west':
      return { x: -1, y: 0, z: 0 };
  }
}

export interface PistonLookup {
  // Solid = something occupying the cell (stone, dirt, block entity).
  isSolid(x: number, y: number, z: number): boolean;
  // Immovable = can't be pushed even if solid (obsidian, bedrock, piston head).
  isImmovable(x: number, y: number, z: number): boolean;
  // Sticky = block sticks to neighbors (honey, slime) — not pushed alone when moved.
  isSticky?(x: number, y: number, z: number): boolean;
}

export interface PushResult {
  moved: readonly { from: Vec3; to: Vec3 }[];
  blocked: boolean;
}

const MAX_PUSH = 12;

export function computePush(piston: Vec3, facing: Facing, lookup: PistonLookup): PushResult {
  const d = facingDelta(facing);
  const chain: Vec3[] = [];
  let cur: Vec3 = { x: piston.x + d.x, y: piston.y + d.y, z: piston.z + d.z };
  while (lookup.isSolid(cur.x, cur.y, cur.z)) {
    if (lookup.isImmovable(cur.x, cur.y, cur.z)) {
      return { moved: [], blocked: true };
    }
    chain.push(cur);
    if (chain.length > MAX_PUSH) return { moved: [], blocked: true };
    cur = { x: cur.x + d.x, y: cur.y + d.y, z: cur.z + d.z };
  }
  // Destination past the chain must be passable (air or passable fluid); by
  // virtue of the loop exiting, `cur` is non-solid.
  const moved: { from: Vec3; to: Vec3 }[] = chain.map((from) => ({
    from,
    to: { x: from.x + d.x, y: from.y + d.y, z: from.z + d.z },
  }));
  return { moved, blocked: false };
}

// Sticky piston pull: retracting a sticky head pulls the block stuck to it
// one cell back toward the piston. Only a single block is pulled (MC v1.20).
export function computePull(piston: Vec3, facing: Facing, lookup: PistonLookup): PushResult {
  const d = facingDelta(facing);
  const neighbour: Vec3 = {
    x: piston.x + d.x * 2,
    y: piston.y + d.y * 2,
    z: piston.z + d.z * 2,
  };
  if (!lookup.isSolid(neighbour.x, neighbour.y, neighbour.z)) {
    return { moved: [], blocked: false };
  }
  if (lookup.isImmovable(neighbour.x, neighbour.y, neighbour.z)) {
    return { moved: [], blocked: true };
  }
  const target: Vec3 = {
    x: piston.x + d.x,
    y: piston.y + d.y,
    z: piston.z + d.z,
  };
  return { moved: [{ from: neighbour, to: target }], blocked: false };
}
