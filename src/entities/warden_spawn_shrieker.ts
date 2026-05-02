// Warden emerges from the ground when the 4th shriek warning level is
// reached. Spawn location is picked 15-32 blocks from the player in a
// non-lit, below-Y=40, within-a-3×3-patch-of-sculk area.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface WardenSpawnLookup {
  isAirAbove: (x: number, y: number, z: number) => boolean;
  isValidGround: (x: number, y: number, z: number) => boolean; // deepslate / sculk
  isDark: (x: number, y: number, z: number) => boolean;
  skyLight: (x: number, y: number, z: number) => number;
}

export interface WardenSpawnQuery {
  playerPos: Vec3;
  lookup: WardenSpawnLookup;
  rng: () => number;
}

export interface WardenSpawnResult {
  pos: Vec3 | null;
  rejectReason: 'ok' | 'no_dark_ground' | 'out_of_range';
}

const MIN_DISTANCE = 15;
const MAX_DISTANCE = 32;
const MAX_ATTEMPTS = 20;
const MAX_WARDEN_Y = 40;

export function findWardenSpawn(q: WardenSpawnQuery): WardenSpawnResult {
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const angle = q.rng() * Math.PI * 2;
    const dist = MIN_DISTANCE + q.rng() * (MAX_DISTANCE - MIN_DISTANCE);
    const dx = Math.floor(Math.cos(angle) * dist);
    const dz = Math.floor(Math.sin(angle) * dist);
    const y = Math.min(Math.floor(q.playerPos.y), MAX_WARDEN_Y);
    const candidate: Vec3 = {
      x: Math.floor(q.playerPos.x) + dx,
      y,
      z: Math.floor(q.playerPos.z) + dz,
    };
    if (!q.lookup.isValidGround(candidate.x, candidate.y - 1, candidate.z)) continue;
    if (!q.lookup.isAirAbove(candidate.x, candidate.y, candidate.z)) continue;
    if (!q.lookup.isAirAbove(candidate.x, candidate.y + 1, candidate.z)) continue;
    if (!q.lookup.isDark(candidate.x, candidate.y, candidate.z)) continue;
    return { pos: candidate, rejectReason: 'ok' };
  }
  return { pos: null, rejectReason: 'no_dark_ground' };
}

// Wiki (minecraft.wiki/w/Warden): the emergence animation runs 225
// ticks (~11.25 seconds), during which the warden is invincible and
// plays the digging/emerging sound. Sibling warden_dig_spawn.ts
// already uses 225 ticks (DIG_EMERGE_TICKS); this module previously
// used 5 seconds (100 ticks), 56% short of canon.
export const EMERGENCE_DURATION_SEC = 11.25;

export interface EmergenceState {
  elapsedSec: number;
  atSpawnPos: Vec3;
}

export function makeEmergence(pos: Vec3): EmergenceState {
  return { elapsedSec: 0, atSpawnPos: { ...pos } };
}

export function tickEmergence(state: EmergenceState, dtSec: number): boolean {
  state.elapsedSec += dtSec;
  return state.elapsedSec >= EMERGENCE_DURATION_SEC;
}

export function emergenceFraction(state: EmergenceState): number {
  return Math.min(1, state.elapsedSec / EMERGENCE_DURATION_SEC);
}
