// Ender Dragon respawn via End Crystal placement. Place 4 end crystals
// around the exit portal → initiates respawn sequence.

export interface RespawnAttempt {
  crystalsPlaced: 4 | 3 | 2 | 1 | 0;
  dragonAlive: boolean;
}

export function canStartRespawn(a: RespawnAttempt): boolean {
  return !a.dragonAlive && a.crystalsPlaced === 4;
}

export const RESPAWN_SEQUENCE_TICKS = 200;

export interface RespawnProgress {
  ticksElapsed: number;
  crystalsRegenerating: number;
}

export function advance(p: RespawnProgress): RespawnProgress {
  return { ...p, ticksElapsed: p.ticksElapsed + 1 };
}

export function isComplete(p: RespawnProgress): boolean {
  return p.ticksElapsed >= RESPAWN_SEQUENCE_TICKS;
}

export const CRYSTAL_PLACEMENT_OFFSETS = [
  { dx: 0, dz: 3 },
  { dx: 3, dz: 0 },
  { dx: 0, dz: -3 },
  { dx: -3, dz: 0 },
];
