// Shulker teleport defensive. When hurt at > 50% HP, the shulker searches
// for a wall within 17 blocks to teleport to, retreating from danger.

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
  // Pick the first candidate wall within 17 blocks.
  for (const wall of q.candidateWalls) {
    const dx = wall.x - state.position.x;
    const dy = wall.y - state.position.y;
    const dz = wall.z - state.position.z;
    if (Math.hypot(dx, dy, dz) <= 17) {
      state.teleportCooldownSec = COOLDOWN_SEC;
      state.position = { ...wall };
      return { teleportTo: wall };
    }
  }
  return { teleportTo: null };
}
