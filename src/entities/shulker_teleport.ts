// Shulker teleport defensive. When hurt below half HP, the shulker
// searches for a wall to teleport to, retreating from danger.
//
// Wiki (minecraft.wiki/w/Shulker#Teleportation): "Each attempt checks
// a random position within a 17x17x17 cube centered on the shulker's
// current position." That cube spans ±8 on each axis (17 positions).
// Old `hypot(dx,dy,dz) <= 17` treated this as a 17-block sphere,
// allowing teleport destinations far outside the wiki cube — e.g.
// a wall at (17, 0, 0) was reachable (wiki: max axis distance is 8).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ShulkerTeleportState {
  position: Vec3;
  hp: number;
  maxHp: number;
  teleportCooldownSec: number;
}

export function makeShulkerTeleport(pos: Vec3): ShulkerTeleportState {
  return { position: { ...pos }, hp: 30, maxHp: 30, teleportCooldownSec: 0 };
}

export interface TeleportQuery {
  candidateWalls: readonly Vec3[];
  dtSec: number;
}

export interface TeleportResult {
  teleportTo: Vec3 | null;
}

const COOLDOWN_SEC = 5;

export function tickShulkerTeleport(state: ShulkerTeleportState, q: TeleportQuery): TeleportResult {
  state.teleportCooldownSec = Math.max(0, state.teleportCooldownSec - q.dtSec);
  if (state.teleportCooldownSec > 0) return { teleportTo: null };
  if (state.hp > state.maxHp / 2) return { teleportTo: null };
  // Pick the first candidate wall inside the wiki's 17×17×17 cube
  // (±8 on each axis).
  for (const wall of q.candidateWalls) {
    const dx = wall.x - state.position.x;
    const dy = wall.y - state.position.y;
    const dz = wall.z - state.position.z;
    if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) <= TELEPORT_AXIS_RANGE) {
      state.teleportCooldownSec = COOLDOWN_SEC;
      state.position = { ...wall };
      return { teleportTo: wall };
    }
  }
  return { teleportTo: null };
}

export const TELEPORT_AXIS_RANGE = 8;
