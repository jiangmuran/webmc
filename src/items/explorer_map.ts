// Explorer maps — bought from cartographer villagers. Mark the location
// of a buried treasure, ocean monument, woodland mansion, trial chamber,
// etc. on an empty map.

export type ExplorerMapKind =
  | 'ocean_monument'
  | 'woodland_mansion'
  | 'buried_treasure'
  | 'trial_chamber'
  | 'ancient_city'
  | 'village';

export interface ExplorerMapState {
  kind: ExplorerMapKind;
  targetX: number;
  targetZ: number;
  discovered: boolean;
}

export function makeExplorerMap(
  kind: ExplorerMapKind,
  targetX: number,
  targetZ: number,
): ExplorerMapState {
  return { kind, targetX, targetZ, discovered: false };
}

export interface ExplorerQuery {
  playerX: number;
  playerZ: number;
}

// Map shows the target when the player is within 2048 blocks.
export function markerFor(state: ExplorerMapState, q: ExplorerQuery): string | null {
  const dx = state.targetX - q.playerX;
  const dz = state.targetZ - q.playerZ;
  const dist = Math.hypot(dx, dz);
  if (dist > 2048) return null;
  return state.kind;
}

// Player walks close enough (64 blocks) → mark as discovered.
export function maybeDiscover(state: ExplorerMapState, q: ExplorerQuery): boolean {
  if (state.discovered) return false;
  const dx = state.targetX - q.playerX;
  const dz = state.targetZ - q.playerZ;
  if (Math.hypot(dx, dz) <= 64) {
    state.discovered = true;
    return true;
  }
  return false;
}
