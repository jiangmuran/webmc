import type { SolidSampler } from '@/physics/collision';

export interface PathfindOptions {
  maxExpansions: number;
  maxJumpUp: number;
  maxFallDown: number;
  heightClearance: number;
}

const DEFAULTS: PathfindOptions = {
  maxExpansions: 2000,
  maxJumpUp: 1,
  maxFallDown: 3,
  heightClearance: 2,
};

export interface PathNode {
  x: number;
  y: number;
  z: number;
}

interface OpenNode {
  key: string;
  x: number;
  y: number;
  z: number;
  g: number;
  f: number;
  parent: string | null;
}

function key(x: number, y: number, z: number): string {
  return `${x.toString()},${y.toString()},${z.toString()}`;
}

function manhattan(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
  return Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);
}

function standable(
  x: number,
  y: number,
  z: number,
  clearance: number,
  isSolid: SolidSampler,
): boolean {
  if (!isSolid(x, y - 1, z)) return false;
  for (let h = 0; h < clearance; h++) {
    if (isSolid(x, y + h, z)) return false;
  }
  return true;
}

// Voxel A* pathfinder. Returns an array of standing-cells from `from` to `to`,
// or null if no path is found within `maxExpansions`. Nodes are "feet"
// positions (the voxel the mob stands on = node.y, with clear space at
// node.y and node.y+1 for a 2-tall mob).
export function findPath(
  from: PathNode,
  to: PathNode,
  isSolid: SolidSampler,
  options: Partial<PathfindOptions> = {},
): PathNode[] | null {
  const opts = { ...DEFAULTS, ...options };

  if (!standable(from.x, from.y, from.z, opts.heightClearance, isSolid)) return null;
  if (!standable(to.x, to.y, to.z, opts.heightClearance, isSolid)) return null;

  const open = new Map<string, OpenNode>();
  const closed = new Set<string>();
  const parents = new Map<string, string | null>();

  const startKey = key(from.x, from.y, from.z);
  open.set(startKey, {
    key: startKey,
    x: from.x,
    y: from.y,
    z: from.z,
    g: 0,
    f: manhattan(from.x, from.y, from.z, to.x, to.y, to.z),
    parent: null,
  });

  let expansions = 0;
  while (open.size > 0 && expansions < opts.maxExpansions) {
    expansions++;
    let current: OpenNode | null = null;
    for (const node of open.values()) {
      if (!current || node.f < current.f) current = node;
    }
    if (!current) break;
    open.delete(current.key);
    closed.add(current.key);
    parents.set(current.key, current.parent);

    if (current.x === to.x && current.y === to.y && current.z === to.z) {
      return reconstruct(parents, current.key);
    }

    for (const [dx, dz] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const) {
      const nx = current.x + dx;
      const nz = current.z + dz;
      // Try same level, or jump up, or fall down.
      for (let dy = -opts.maxFallDown; dy <= opts.maxJumpUp; dy++) {
        const ny = current.y + dy;
        if (!standable(nx, ny, nz, opts.heightClearance, isSolid)) continue;
        if (dy > 0 && isSolid(current.x, current.y + opts.heightClearance, current.z)) continue;
        const stepCost = dy > 0 ? 1.5 : dy < 0 ? 1 + 0.2 * Math.abs(dy) : 1;
        const g = current.g + stepCost;
        const nkey = key(nx, ny, nz);
        if (closed.has(nkey)) continue;
        const existing = open.get(nkey);
        if (existing && existing.g <= g) continue;
        open.set(nkey, {
          key: nkey,
          x: nx,
          y: ny,
          z: nz,
          g,
          f: g + manhattan(nx, ny, nz, to.x, to.y, to.z),
          parent: current.key,
        });
      }
    }
  }

  return null;
}

function reconstruct(parents: Map<string, string | null>, endKey: string): PathNode[] {
  const path: PathNode[] = [];
  let k: string | null = endKey;
  while (k) {
    const [xs, ys, zs] = k.split(',');
    path.push({ x: Number(xs), y: Number(ys), z: Number(zs) });
    k = parents.get(k) ?? null;
  }
  return path.reverse();
}
