// Sponge. A dry sponge placed touching water soaks up every water block
// in a 7×7×7 region (up to 65 blocks) then becomes a wet sponge.
// Wet sponge dries in a furnace or in the Nether.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SpongeLookup {
  isWaterSource(x: number, y: number, z: number): boolean;
}

const ABSORB_REACH = 7;
const MAX_ABSORBED = 65;

// Returns the list of water positions to clear, BFS from the sponge.
export function absorbWater(spongePos: Vec3, lookup: SpongeLookup): readonly Vec3[] {
  const absorbed: Vec3[] = [];
  const visited = new Set<string>();
  const queue: { pos: Vec3; depth: number }[] = [{ pos: spongePos, depth: 0 }];
  const key = (p: Vec3): string => `${p.x.toString()},${p.y.toString()},${p.z.toString()}`;
  visited.add(key(spongePos));
  // Head-pointer dequeue (was queue.shift O(N) per pop). With
  // MAX_ABSORBED=65 and depth-7 BFS, the queue can hit ~300 nodes.
  let qHead = 0;
  while (qHead < queue.length && absorbed.length < MAX_ABSORBED) {
    const head = queue[qHead++];
    if (!head) break;
    if (head.depth > ABSORB_REACH) continue;
    for (const [dx, dy, dz] of [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ] as const) {
      const np = { x: head.pos.x + dx, y: head.pos.y + dy, z: head.pos.z + dz };
      const nk = key(np);
      if (visited.has(nk)) continue;
      visited.add(nk);
      if (!lookup.isWaterSource(np.x, np.y, np.z)) continue;
      absorbed.push(np);
      if (absorbed.length >= MAX_ABSORBED) break;
      queue.push({ pos: np, depth: head.depth + 1 });
    }
  }
  return absorbed;
}

// Wet → dry transition via furnace or nether.
export interface DryCtx {
  inNether: boolean;
}

export function shouldDry(ctx: DryCtx): boolean {
  return ctx.inNether;
}
