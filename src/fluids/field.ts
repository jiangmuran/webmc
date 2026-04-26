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
  const out: PosKey = { x: 0, y: 0, z: 0 };
  parseKeyInto(k, out);
  return out;
}

// In-place variant that mutates `out` instead of allocating. The split
// + map(Number) version allocated a string array, a number array, AND
// a {x,y,z} literal per call — for a 5k-cell lava lake that was 15k
// throwaway objects per tick. tickFluid uses a module-scope scratch
// across both the per-cell loop and the BFS dry-up.
export function parseKeyInto(k: string, out: PosKey): PosKey {
  const c1 = k.indexOf(',');
  const c2 = k.indexOf(',', c1 + 1);
  out.x = +k.substring(0, c1);
  out.y = +k.substring(c1 + 1, c2);
  out.z = +k.substring(c2 + 1);
  return out;
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

// Reused per-call scratches. tickFluid is called from FluidWorld.tick
// synchronously; the caller drains `updates` via applyFluidUpdates and
// reads `stabilized` immediately, then doesn't keep references. All
// four collections grow with active fluid cells (5000+ at big lakes),
// so recycling rather than re-allocating each tick saves substantial
// GC pressure.
const TICK_UPDATES_SCRATCH = new Map<string, FluidCell | null>();
const TICK_MERGED_SCRATCH = new Map<string, FluidCell>();
const TICK_REACHABLE_SCRATCH = new Set<string>();
const TICK_QUEUE_SCRATCH: string[] = [];
const TICK_RESULT_SCRATCH: FluidTickResult = {
  updates: TICK_UPDATES_SCRATCH,
  stabilized: false,
};
// Per-cell parseKey scratch — see parseKeyInto. Single instance is
// safe because the per-cell + BFS loops below read pos.x/y/z
// synchronously and don't recurse into parseKey.
const TICK_POS_SCRATCH: PosKey = { x: 0, y: 0, z: 0 };

// Module-scope snapshot helper. Was a fresh arrow closure allocated
// per tickFluid call, capturing the per-tick `cells` + `updates`
// maps. Pulling it out to a free function with explicit args
// eliminates the closure allocation (one per fluid tick = 4Hz
// baseline) while keeping the same fast-path: post-update value
// shadows the pre-tick cell value.
function snapshotCell(
  cells: ReadonlyMap<string, FluidCell>,
  updates: Map<string, FluidCell | null>,
  x: number,
  y: number,
  z: number,
): FluidCell | null {
  const k = keyOfXYZ(x, y, z);
  const u = updates.get(k);
  if (u !== undefined) return u;
  return cells.get(k) ?? null;
}

// One fluid tick. Given sources (current fluid cells) + a solid-block sampler,
// returns the new/changed cells. Horizontal flow decreases level by
// attenuation per step; downward flow is unconditional at full level.
export function tickFluid(
  cells: ReadonlyMap<string, FluidCell>,
  isSolid: SolidSampler,
): FluidTickResult {
  const updates = TICK_UPDATES_SCRATCH;
  updates.clear();

  for (const [key, cell] of cells) {
    if (cell.level <= 0) continue;
    const pos = parseKeyInto(key, TICK_POS_SCRATCH);

    // Downward flow: if below is empty and not solid, fill at this cell's
    // level (capped). Source cells spread downward at full level.
    const belowKey = keyOfXYZ(pos.x, pos.y - 1, pos.z);
    const belowSolid = isSolid(pos.x, pos.y - 1, pos.z);
    if (!belowSolid) {
      const below = snapshotCell(cells, updates, pos.x, pos.y - 1, pos.z);
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
    // flow horizontally mid-air). Inlined the previous IIFE — was a
    // fresh arrow allocated per cell that wasn't directly solid-supported.
    let supported = belowSolid;
    if (!supported) {
      const b = snapshotCell(cells, updates, pos.x, pos.y - 1, pos.z);
      supported = b !== null && b.kind === cell.kind;
    }
    if (!supported) continue;

    const step = attenuation(cell.kind);
    const outLevel = cell.source ? LEVEL_SOURCE - step : cell.level - step;
    if (outLevel <= 0) continue;

    for (const [dx, dz] of HORIZ) {
      const nx = pos.x + dx;
      const ny = pos.y;
      const nz = pos.z + dz;
      if (isSolid(nx, ny, nz)) continue;
      const neighbour = snapshotCell(cells, updates, nx, ny, nz);
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
  const merged = TICK_MERGED_SCRATCH;
  merged.clear();
  for (const [k, c] of cells) merged.set(k, c);
  for (const [k, u] of updates) {
    if (u === null) merged.delete(k);
    else merged.set(k, u);
  }
  const reachable = TICK_REACHABLE_SCRATCH;
  reachable.clear();
  const queue = TICK_QUEUE_SCRATCH;
  queue.length = 0;
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
    const pos = parseKeyInto(k, TICK_POS_SCRATCH);
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

  TICK_RESULT_SCRATCH.stabilized = updates.size === 0;
  return TICK_RESULT_SCRATCH;
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
