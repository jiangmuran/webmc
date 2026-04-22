// Ender dragon respawn ritual. Place 4 end crystals around the central
// bedrock "fountain" → respawn the dragon. The crystals pop + regenerate
// during the respawn sequence.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface RespawnQuery {
  fountainCenter: Vec3;
  crystalPositions: readonly Vec3[];
}

// 4 crystals must sit at cardinal sides of the fountain.
export function detectRespawnConfig(q: RespawnQuery): boolean {
  if (q.crystalPositions.length !== 4) return false;
  const expected = [
    { x: q.fountainCenter.x + 4, y: q.fountainCenter.y, z: q.fountainCenter.z },
    { x: q.fountainCenter.x - 4, y: q.fountainCenter.y, z: q.fountainCenter.z },
    { x: q.fountainCenter.x, y: q.fountainCenter.y, z: q.fountainCenter.z + 4 },
    { x: q.fountainCenter.x, y: q.fountainCenter.y, z: q.fountainCenter.z - 4 },
  ];
  for (const want of expected) {
    if (!q.crystalPositions.some((c) => c.x === want.x && c.y === want.y && c.z === want.z)) {
      return false;
    }
  }
  return true;
}

export type RespawnPhase = 'idle' | 'crystals_rising' | 'dragon_materialize' | 'roar' | 'done';

export interface RespawnState {
  phase: RespawnPhase;
  elapsedSec: number;
}

export function makeRespawnState(): RespawnState {
  return { phase: 'idle', elapsedSec: 0 };
}

export function beginRespawn(state: RespawnState): void {
  state.phase = 'crystals_rising';
  state.elapsedSec = 0;
}

export function tickRespawn(state: RespawnState, dtSec: number): RespawnPhase {
  if (state.phase === 'idle' || state.phase === 'done') return state.phase;
  state.elapsedSec += dtSec;
  switch (state.phase) {
    case 'crystals_rising':
      if (state.elapsedSec >= 4) {
        state.phase = 'dragon_materialize';
        state.elapsedSec = 0;
      }
      break;
    case 'dragon_materialize':
      if (state.elapsedSec >= 3) {
        state.phase = 'roar';
        state.elapsedSec = 0;
      }
      break;
    case 'roar':
      if (state.elapsedSec >= 2) {
        state.phase = 'done';
      }
      break;
    default:
      break;
  }
  return state.phase;
}
