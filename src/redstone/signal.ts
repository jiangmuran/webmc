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

const NEIGHBORS: readonly (readonly [number, number, number])[] = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
];

export type BlockLookup = (x: number, y: number, z: number) => RedstoneBlock;

// computePower: flood-fill dust power from all sources within the given
// bounded region. Returns a Map<posKey, PowerLevel> that callers can use to
// drive mechanism state (doors, pistons, lamps).
export function computePower(
  sources: readonly PosKey[],
  lookup: BlockLookup,
  sourceLevel: (pos: PosKey) => PowerLevel = () => MAX_POWER,
): Map<string, PowerLevel> {
  const power = new Map<string, PowerLevel>();
  interface QueueItem {
    pos: PosKey;
    level: PowerLevel;
  }
  const frontier: QueueItem[] = [];

  for (const src of sources) {
    const level = sourceLevel(src);
    if (level <= 0) continue;
    // Source seeds neighbors at their own level (dust neighbor gets level-1,
    // non-dust conductor gets level directly as "strong power").
    for (const [dx, dy, dz] of NEIGHBORS) {
      const nx = src.x + dx;
      const ny = src.y + dy;
      const nz = src.z + dz;
      const n = lookup(nx, ny, nz);
      if (n.kind === 'dust') {
        const seed = Math.max(level - 1, MIN_POWER);
        insertIfHigherXYZ(power, nx, ny, nz, seed);
        frontier.push({ pos: { x: nx, y: ny, z: nz }, level: seed });
      } else if (n.opaque || n.kind === 'door') {
        insertIfHigherXYZ(power, nx, ny, nz, level);
      }
    }
  }

  // BFS dust paths. Head-pointer dequeue (Array.shift is O(N) per pop;
  // a long redstone wire propagation could push hundreds of nodes).
  let qHead = 0;
  while (qHead < frontier.length) {
    const item = frontier[qHead++];
    if (!item) break;
    if (item.level <= 1) continue;
    const here = lookup(item.pos.x, item.pos.y, item.pos.z);
    if (here.kind !== 'dust') continue;
    const nextLevel = item.level - 1;
    for (const [dx, dy, dz] of NEIGHBORS) {
      const nx = item.pos.x + dx;
      const ny = item.pos.y + dy;
      const nz = item.pos.z + dz;
      const n = lookup(nx, ny, nz);
      if (n.kind === 'dust') {
        if (insertIfHigherXYZ(power, nx, ny, nz, nextLevel)) {
          frontier.push({ pos: { x: nx, y: ny, z: nz }, level: nextLevel });
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
