// Sponge absorbs up to 65 water blocks in a 7x7x7 volume (flood-fill
// capped at 65). Becomes wet sponge; dried in furnace/nether.

export interface AbsorbQuery {
  at: (x: number, y: number, z: number) => 'water' | 'air' | 'solid';
  sx: number;
  sy: number;
  sz: number;
}

export const ABSORB_LIMIT = 65;
export const ABSORB_RADIUS = 6;

type QEntry = [number, number, number, number];

export function absorbFrom(q: AbsorbQuery): { positions: [number, number, number][] } {
  const visited = new Set<string>();
  const queue: QEntry[] = [[q.sx, q.sy, q.sz, 0]];
  const absorbed: [number, number, number][] = [];
  // Head-pointer dequeue (Array.shift is O(N) per pop).
  let qHead = 0;
  while (qHead < queue.length && absorbed.length < ABSORB_LIMIT) {
    const entry = queue[qHead++];
    if (!entry) break;
    const [x, y, z, d] = entry;
    const key = `${x},${y},${z}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (d > ABSORB_RADIUS) continue;
    const b = q.at(x, y, z);
    if (b === 'solid') continue;
    if (b === 'water') absorbed.push([x, y, z]);
    for (const [dx, dy, dz] of [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ] as const) {
      queue.push([x + dx, y + dy, z + dz, d + 1]);
    }
  }
  return { positions: absorbed };
}
