export interface LightNode {
  x: number;
  y: number;
  z: number;
  level: number;
}

export function propagateBlockLight(
  sources: readonly LightNode[],
  opacity: (x: number, y: number, z: number) => number,
): Map<string, number> {
  const result = new Map<string, number>();
  const queue: LightNode[] = [...sources];
  // Head-pointer dequeue: Array.shift is O(N) per pop, making BFS
  // quadratic in node count. With light propagating up to 15 levels
  // through a 30³ region, this is ~25K nodes — quadratic is unusable.
  let qHead = 0;
  while (qHead < queue.length) {
    const n = queue[qHead++];
    if (n === undefined) break;
    const key = `${n.x},${n.y},${n.z}`;
    const existing = result.get(key) ?? 0;
    if (n.level <= existing) continue;
    result.set(key, n.level);
    if (n.level <= 1) continue;
    const dirs: [number, number, number][] = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
    for (const [dx, dy, dz] of dirs) {
      const nx = n.x + dx;
      const ny = n.y + dy;
      const nz = n.z + dz;
      const reduce = Math.max(1, opacity(nx, ny, nz));
      const nextLevel = n.level - reduce;
      if (nextLevel > 0) queue.push({ x: nx, y: ny, z: nz, level: nextLevel });
    }
  }
  return result;
}

export const MAX_LIGHT = 15;
