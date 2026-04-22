// Endermite. Tiny purple hostile mob with a 5% spawn chance when a
// player throws an ender pearl. Despawns in ~2 minutes. Endermen will
// aggro and attack endermites.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface EndermiteState {
  id: number;
  position: Vec3;
  health: number;
  ageSec: number;
}

export const ENDERMITE_MAX_HEALTH = 8;
const DESPAWN_AFTER_SEC = 120;

export function makeEndermite(id: number, at: Vec3): EndermiteState {
  return { id, position: { ...at }, health: ENDERMITE_MAX_HEALTH, ageSec: 0 };
}

export interface EndermiteTickResult {
  despawned: boolean;
}

export function tickEndermite(state: EndermiteState, dtSec: number): EndermiteTickResult {
  state.ageSec += dtSec;
  if (state.ageSec >= DESPAWN_AFTER_SEC) return { despawned: true };
  return { despawned: false };
}

// Pearl throw spawn roll: 5% per throw.
export const PEARL_ENDERMITE_CHANCE = 0.05;

export function shouldSpawnFromPearl(roll: number): boolean {
  return roll < PEARL_ENDERMITE_CHANCE;
}

// Endermen hunt endermites in a 64-block radius.
export const ENDERMAN_HUNT_RADIUS = 64;

export function isHuntedBy(endermanPos: Vec3, endermitePos: Vec3): boolean {
  const dx = endermitePos.x - endermanPos.x;
  const dy = endermitePos.y - endermanPos.y;
  const dz = endermitePos.z - endermanPos.z;
  return Math.hypot(dx, dy, dz) <= ENDERMAN_HUNT_RADIUS;
}
