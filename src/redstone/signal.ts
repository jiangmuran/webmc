export type PowerLevel = number;

export const MAX_POWER: PowerLevel = 15;
export const MIN_POWER: PowerLevel = 0;

export type RedstoneKind =
  | 'none'
  | 'dust'
  | 'torch'
  | 'lever'
  | 'button'
  | 'pressure_plate'
  | 'door'
  | 'conductor';

export interface RedstoneBlock {
  kind: RedstoneKind;
  opaque: boolean;
  // Interactable state: true if the lever is flipped, button is pressed,
  // pressure plate is weighted, or torch mount is unpowered (for torches).
  active?: boolean;
}

export interface PosKey {
  x: number;
  y: number;
  z: number;
}

export function keyOf(p: PosKey): string {
  return `${p.x.toString()},${p.y.toString()},${p.z.toString()}`;
}

export function parseKey(key: string): PosKey {
  const parts = key.split(',');
  return {
    x: Number(parts[0] ?? 0),
    y: Number(parts[1] ?? 0),
    z: Number(parts[2] ?? 0),
  };
}

// Parallel neighbor-offset arrays. Was a tuple-of-tuples requiring
// `for (const [dx, dy, dz] of NEIGHBORS)` per iteration — that's
// iterator-protocol + destructure overhead per neighbor visit.
// Index-based access on three flat arrays is straightforward inline
// reads.
const NEIGHBORS_DX: readonly number[] = [-1, 1, 0, 0, 0, 0];
const NEIGHBORS_DY: readonly number[] = [0, 0, -1, 1, 0, 0];
const NEIGHBORS_DZ: readonly number[] = [0, 0, 0, 0, -1, 1];

export type BlockLookup = (x: number, y: number, z: number) => RedstoneBlock;

// Parallel BFS-frontier scratches. Was `frontier.push({pos: {x,y,z},
// level})` per propagation step — one fresh QueueItem + one nested
// PosKey per push, hundreds per recompute on a long wire (10Hz). Now
// 4 numeric pushes into parallel int arrays. Caller (RedstoneWorld
// tick / currentPower) runs computePower synchronously, so per-module
// reuse is safe.
const FRONTIER_X: number[] = [];
const FRONTIER_Y: number[] = [];
const FRONTIER_Z: number[] = [];
const FRONTIER_LEVEL: number[] = [];
// Returned power map. Caller reads synchronously and discards before
// the next computePower call — share the Map and clear at the start.
// CONTRACT: the returned Map is invalidated by the next computePower call.
const POWER_SCRATCH = new Map<string, PowerLevel>();

// computePower: flood-fill dust power from all sources within the given
// bounded region. Returns a Map<posKey, PowerLevel> that callers can use to
// drive mechanism state (doors, pistons, lamps).
export function computePower(
  sources: readonly PosKey[],
  lookup: BlockLookup,
  sourceLevel: (pos: PosKey) => PowerLevel = () => MAX_POWER,
): Map<string, PowerLevel> {
  const power = POWER_SCRATCH;
  power.clear();
  const fx = FRONTIER_X;
  const fy = FRONTIER_Y;
  const fz = FRONTIER_Z;
  const fl = FRONTIER_LEVEL;
  fx.length = 0;
  fy.length = 0;
  fz.length = 0;
  fl.length = 0;

  for (const src of sources) {
    const level = sourceLevel(src);
    if (level <= 0) continue;
    // Source seeds neighbors at their own level (dust neighbor gets level-1,
    // non-dust conductor gets level directly as "strong power").
    for (let ni = 0; ni < 6; ni++) {
      const nx = src.x + NEIGHBORS_DX[ni]!;
      const ny = src.y + NEIGHBORS_DY[ni]!;
      const nz = src.z + NEIGHBORS_DZ[ni]!;
      const n = lookup(nx, ny, nz);
      if (n.kind === 'dust') {
        const seed = Math.max(level - 1, MIN_POWER);
        insertIfHigherXYZ(power, nx, ny, nz, seed);
        fx.push(nx);
        fy.push(ny);
        fz.push(nz);
        fl.push(seed);
      } else if (n.opaque || n.kind === 'door') {
        insertIfHigherXYZ(power, nx, ny, nz, level);
      }
    }
  }

  // BFS dust paths. Head-pointer dequeue (Array.shift is O(N) per pop;
  // a long redstone wire propagation could push hundreds of nodes).
  let qHead = 0;
  while (qHead < fx.length) {
    const ix = fx[qHead]!;
    const iy = fy[qHead]!;
    const iz = fz[qHead]!;
    const ilevel = fl[qHead]!;
    qHead++;
    if (ilevel <= 1) continue;
    const here = lookup(ix, iy, iz);
    if (here.kind !== 'dust') continue;
    const nextLevel = ilevel - 1;
    for (let ni = 0; ni < 6; ni++) {
      const dy = NEIGHBORS_DY[ni]!;
      const nx = ix + NEIGHBORS_DX[ni]!;
      const ny = iy + dy;
      const nz = iz + NEIGHBORS_DZ[ni]!;
      const n = lookup(nx, ny, nz);
      if (n.kind === 'dust') {
        if (insertIfHigherXYZ(power, nx, ny, nz, nextLevel)) {
          fx.push(nx);
          fy.push(ny);
          fz.push(nz);
          fl.push(nextLevel);
        }
      } else if (n.kind === 'door' || (n.opaque && dy === -1)) {
        // dust weakly powers the block beneath it
        insertIfHigherXYZ(power, nx, ny, nz, nextLevel);
      }
    }
  }

  return power;
}

// Coord-direct variant. The per-neighbor pattern was building a fresh
// {x,y,z} PosKey just so insertIfHigher could pass it to keyOf — the
// PosKey itself was never stored, only its key form. For a long
// redstone wire (~50 dust segments × 6 neighbors = 300+ visits per
// recompute, fired at 10Hz), each saved literal compounds.
function insertIfHigherXYZ(
  map: Map<string, PowerLevel>,
  x: number,
  y: number,
  z: number,
  level: PowerLevel,
): boolean {
  const k = `${x.toString()},${y.toString()},${z.toString()}`;
  const existing = map.get(k) ?? MIN_POWER;
  if (level > existing) {
    map.set(k, level);
    return true;
  }
  return false;
}
