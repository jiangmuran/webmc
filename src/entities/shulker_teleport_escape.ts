// Shulker teleport escape. When damaged and shell is closed, a
// shulker may teleport to an adjacent block up to 8 blocks away.
// Must land flush against another block.

export interface Shulker {
  pos: { x: number; y: number; z: number };
  shellOpenRatio: number; // 0..1
  color: string;
  lastTeleportMs: number;
}

// Wiki (minecraft.wiki/w/Shulker): teleport range is up to 17 blocks
// and the cooldown after teleporting is ~5 seconds. Old constants
// were 8 blocks / 10 seconds — half the wiki range and twice the
// wiki cooldown, both inconsistent with sibling shulker_teleport.ts
// which already uses 17 / 5s.
export const TELEPORT_COOLDOWN_MS = 5_000;
export const TELEPORT_RADIUS = 17;

export interface TpQuery {
  nowMs: number;
  rand: () => number;
  // checks if the candidate position is adjacent to a solid block
  isValid: (x: number, y: number, z: number) => boolean;
}

export function tryTeleport(s: Shulker, q: TpQuery): boolean {
  if (s.shellOpenRatio > 0.1) return false;
  if (q.nowMs - s.lastTeleportMs < TELEPORT_COOLDOWN_MS) return false;
  for (let i = 0; i < 16; i++) {
    const dx = Math.floor((q.rand() - 0.5) * 2 * TELEPORT_RADIUS);
    const dy = Math.floor((q.rand() - 0.5) * 2 * TELEPORT_RADIUS);
    const dz = Math.floor((q.rand() - 0.5) * 2 * TELEPORT_RADIUS);
    const nx = s.pos.x + dx;
    const ny = s.pos.y + dy;
    const nz = s.pos.z + dz;
    if (q.isValid(nx, ny, nz)) {
      s.pos = { x: nx, y: ny, z: nz };
      s.lastTeleportMs = q.nowMs;
      return true;
    }
  }
  return false;
}

// Shulker opens shell to fire a shulker bullet; open cycle takes
// 20 ticks.
export const OPEN_CYCLE_TICKS = 20;
