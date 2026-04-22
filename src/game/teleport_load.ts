// Teleport chunk preload. When a player is about to teleport (nether
// portal, ender pearl, end gateway, /tp), the engine schedules the
// destination's chunk column to load BEFORE the player is moved, so the
// client doesn't see a "falling-through-void" flash.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type TeleportReason =
  | 'nether_portal'
  | 'end_portal'
  | 'end_gateway'
  | 'ender_pearl'
  | 'chorus_fruit'
  | 'command'
  | 'respawn';

export interface TeleportRequest {
  readonly playerId: string;
  readonly from: Vec3;
  readonly to: Vec3;
  readonly fromDim: string;
  readonly toDim: string;
  readonly reason: TeleportReason;
  readonly requestedAtSec: number;
}

export type TeleportStatus = 'pending_chunks' | 'ready' | 'completed' | 'timed_out';

export interface ChunkLoadState {
  loaded: Set<string>; // "dim:cx,cz" keys
  pending: Set<string>;
}

export function makeChunkLoadState(): ChunkLoadState {
  return { loaded: new Set(), pending: new Set() };
}

// 3×3 column around the destination. Callers may override radius for
// e.g. /tp with large view distance.
export function requiredChunksFor(req: TeleportRequest, radius = 1): string[] {
  const cx = Math.floor(req.to.x / 16);
  const cz = Math.floor(req.to.z / 16);
  const keys: string[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      keys.push(`${req.toDim}:${cx + dx},${cz + dz}`);
    }
  }
  return keys;
}

export interface TeleportPlanResult {
  status: TeleportStatus;
  missingChunks: string[];
  elapsedSec: number;
}

const TIMEOUT_SEC = 8;

export function evaluateTeleport(
  req: TeleportRequest,
  state: ChunkLoadState,
  nowSec: number,
): TeleportPlanResult {
  const required = requiredChunksFor(req);
  const missing = required.filter((k) => !state.loaded.has(k));
  const elapsed = nowSec - req.requestedAtSec;
  if (missing.length === 0) return { status: 'ready', missingChunks: [], elapsedSec: elapsed };
  if (elapsed >= TIMEOUT_SEC) {
    return { status: 'timed_out', missingChunks: missing, elapsedSec: elapsed };
  }
  for (const m of missing) state.pending.add(m);
  return { status: 'pending_chunks', missingChunks: missing, elapsedSec: elapsed };
}

export function markChunkLoaded(state: ChunkLoadState, key: string): void {
  state.loaded.add(key);
  state.pending.delete(key);
}
