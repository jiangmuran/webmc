// Scaffolding. A bamboo-latticed block the player can climb + place stacks
// on without support. Floats up to 6 blocks horizontally from a support;
// when the support breaks, the whole chain falls.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ScaffoldingLookup {
  isScaffolding(x: number, y: number, z: number): boolean;
  hasSupport(x: number, y: number, z: number): boolean; // solid below or 6-horizontal-chain to support
}

const MAX_DISTANCE = 6;

// Returns the shortest horizontal-chain distance to a support block. 0 =
// directly supported, -1 = unsupported/unreachable within 6.
export function distanceToSupport(pos: Vec3, lookup: ScaffoldingLookup): number {
  if (lookup.hasSupport(pos.x, pos.y, pos.z)) return 0;
  // BFS over scaffolding cells in the plane y=pos.y, radius 6.
  const visited = new Set<string>();
  interface Q {
    x: number;
    z: number;
    d: number;
  }
  const queue: Q[] = [{ x: pos.x, z: pos.z, d: 0 }];
  const key = (x: number, z: number): string => `${x.toString()},${z.toString()}`;
  visited.add(key(pos.x, pos.z));
  while (queue.length > 0) {
    const head = queue.shift();
    if (!head) break;
    if (head.d >= MAX_DISTANCE) continue;
    for (const [dx, dz] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as const) {
      const nx = head.x + dx;
      const nz = head.z + dz;
      const k = key(nx, nz);
      if (visited.has(k)) continue;
      visited.add(k);
      if (!lookup.isScaffolding(nx, pos.y, nz)) continue;
      if (lookup.hasSupport(nx, pos.y, nz)) return head.d + 1;
      queue.push({ x: nx, z: nz, d: head.d + 1 });
    }
  }
  return -1;
}

export function isFloating(pos: Vec3, lookup: ScaffoldingLookup): boolean {
  return distanceToSupport(pos, lookup) < 0;
}
