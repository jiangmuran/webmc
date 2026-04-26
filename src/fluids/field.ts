export type FluidKind = 'water' | 'lava';
export const LEVEL_SOURCE = 8;
export const LEVEL_EMPTY = 0;

export interface FluidCell {
  kind: FluidKind;
  level: number;
  source: boolean;
}

export interface PosKey {
  x: number;
  y: number;
  z: number;
}

export function keyOf(p: PosKey): string {
  return `${p.x.toString()},${p.y.toString()},${p.z.toString()}`;
}

// Same encoding as keyOf but takes raw coords — saves callers building
// a {x,y,z} literal just to pass through. The hot tickFluid path hits
// this dozens of times per cell per tick (downward, four horizontal
// neighbors, snapshot-during-flow, BFS dry-up).
export function keyOfXYZ(x: number, y: number, z: number): string {
  return `${x.toString()},${y.toString()},${z.toString()}`;
}

export function parseKey(k: string): PosKey {
  const [x, y, z] = k.split(',').map(Number);
  return { x: x ?? 0, y: y ?? 0, z: z ?? 0 };
}

export type SolidSampler = (x: number, y: number, z: number) => boolean;
export type FluidSampler = (x: number, y: number, z: number) => FluidCell | null;

const HORIZ: readonly (readonly [number, number])[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export interface FluidTickResult {
  updates: Map<string, FluidCell | null>;
  stabilized: boolean;
}

function attenuation(kind: FluidKind): number {
  return kind === 'water' ? 1 : 2;
}

// One fluid tick. Given sources (current fluid cells) + a solid-block sampler,
// returns the new/changed cells. Horizontal flow decreases level by
// attenuation per step; downward flow is unconditional at full level.
export function tickFluid(
  cells: ReadonlyMap<string, FluidCell>,
  isSolid: SolidSampler,
): FluidTickResult {
  const updates = new Map<string, FluidCell | null>();
  const snapshot: FluidSampler = (x, y, z) => {
    // Compute the key once; was building two {x,y,z} literals + two
    // template strings per snapshot lookup.
    const k = keyOfXYZ(x, y, z);
    const u = updates.get(k);
    if (u !== undefined) return u;
    return cells.get(k) ?? null;
  };

  for (const [key, cell] of cells) {
    if (cell.level <= 0) continue;
    const pos = parseKey(key);

    // Downward flow: if below is empty and not solid, fill at this cell's
    // level (capped). Source cells spread downward at full level.
    const belowKey = keyOfXYZ(pos.x, pos.y - 1, pos.z);
    if (!isSolid(pos.x, pos.y - 1, pos.z)) {
      const below = snapshot(pos.x, pos.y - 1, pos.z);
      const targetLevel = cell.source ? LEVEL_SOURCE - 1 : Math.max(cell.level, LEVEL_SOURCE - 1);
      if (below?.kind !== cell.kind || below.level < targetLevel) {
        updates.set(belowKey, {
          kind: cell.kind,
          level: targetLevel,
          source: false,
        });
      }
    }

    // Horizontal flow only if there's a surface under this cell (it can't
    // flow horizontally mid-air).
    const supported =
      isSolid(pos.x, pos.y - 1, pos.z) ||
      (() => {
        const b = snapshot(pos.x, pos.y - 1, pos.z);
        return b !== null && b.kind === cell.kind;
      })();
    if (!supported) continue;

    const step = attenuation(cell.kind);
    const outLevel = cell.source ? LEVEL_SOURCE - step : cell.level - step;
    if (outLevel <= 0) continue;

    for (const [dx, dz] of HORIZ) {
      const nx = pos.x + dx;
      const ny = pos.y;
      const nz = pos.z + dz;
      if (isSolid(nx, ny, nz)) continue;
      const neighbour = snapshot(nx, ny, nz);
      if (neighbour && neighbour.kind !== cell.kind) continue;
      if (neighbour && neighbour.level >= outLevel) continue;
      updates.set(keyOfXYZ(nx, ny, nz), {
        kind: cell.kind,
        level: outLevel,
        source: false,
      });
    }
  }

  // Dry-up: BFS from sources over the post-phase-1 state. Cells not
  // reached (disconnected puddles) are removed. A neighbour is reachable
  // below unconditionally (gravity) or horizontally if strictly lower
  // level (downhill flow).
  const merged = new Map<string, FluidCell>();
  for (const [k, c] of cells) merged.set(k, c);
  for (const [k, u] of updates) {
    if (u === null) merged.delete(k);
    else merged.set(k, u);
  }
  const reachable = new Set<string>();
  const queue: string[] = [];
  for (const [k, c] of merged) {
    if (c.source) {
      reachable.add(k);
      queue.push(k);
    }
  }
  // Head-pointer dequeue: queue.shift() is O(N) per pop, making
  // this BFS O(N^2) in fluid-cell count. Big lava lake or an aqueduct
  // can have ~5000 cells; head pointer keeps it linear.
  let qHead = 0;
  while (qHead < queue.length) {
    const k = queue[qHead++];
    if (k === undefined) break;
    const c = merged.get(k);
    if (c === undefined) continue;
    const pos = parseKey(k);
    const belowKey = keyOfXYZ(pos.x, pos.y - 1, pos.z);
    if (!reachable.has(belowKey)) {
      if (merged.get(belowKey)?.kind === c.kind) {
        reachable.add(belowKey);
        queue.push(belowKey);
      }
    }
    for (const [dx, dz] of HORIZ) {
      const nk = keyOfXYZ(pos.x + dx, pos.y, pos.z + dz);
      if (reachable.has(nk)) continue;
      const nc = merged.get(nk);
      if (nc?.kind !== c.kind) continue;
      if (nc.level < c.level) {
        reachable.add(nk);
        queue.push(nk);
      }
    }
  }
  for (const [k, c] of merged) {
    if (c.source || reachable.has(k)) continue;
    updates.set(k, null);
  }

  return { updates, stabilized: updates.size === 0 };
}

export function applyFluidUpdates(
  cells: Map<string, FluidCell>,
  updates: ReadonlyMap<string, FluidCell | null>,
): void {
  for (const [key, cell] of updates) {
    if (cell === null) cells.delete(key);
    else cells.set(key, cell);
  }
}
