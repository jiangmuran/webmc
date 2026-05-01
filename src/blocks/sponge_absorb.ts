// Sponge absorbs up to 118 water source/flowing blocks within a
// taxicab (Manhattan) distance of 6 from the sponge. Becomes wet
// sponge; dried in furnace/nether. Wiki:
// minecraft.wiki/w/Sponge#Absorption.

export interface AbsorbQuery {
  at: (x: number, y: number, z: number) => 'water' | 'air' | 'solid';
  sx: number;
  sy: number;
  sz: number;
}

// Wiki body text: "absorbs both flowing and source blocks of water up
// to 6 blocks away (taken as a taxicab distance) ... A sponge does
// not absorb more than 118 blocks of water". 7 / 65 was the original
// 1.8 implementation; current in-game value is 6 / 118.
export const ABSORB_LIMIT = 118;
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
