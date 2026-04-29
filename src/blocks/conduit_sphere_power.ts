// Conduit. Needs to be surrounded by a multi-block prismarine frame
// submerged in water. Active state grants Conduit Power status to
// nearby players and damages hostile mobs within range.

export interface ConduitQuery {
  prismarineBlocks: number; // # valid frame blocks
  submerged: boolean;
}

export const MIN_FRAME = 16;
export const MAX_FRAME = 42;

export function isActive(q: ConduitQuery): boolean {
  return q.submerged && q.prismarineBlocks >= MIN_FRAME;
}

// Wiki: range = floor(frame/7) * 16, capped at 96. 16 blocks → 32,
// 24 → 48, 32 → 64, 40 → 80, 42 (max) → 96. Old code added an extra
// +16 (giving 48 at the minimum) which doesn't match wiki.
export function grantRadius(q: ConduitQuery): number {
  if (!isActive(q)) return 0;
  const frames = Math.min(MAX_FRAME, q.prismarineBlocks);
  const tiers = Math.floor(frames / 7);
  return Math.min(96, tiers * 16);
}

// Wiki: damages hostile mobs in water within a FIXED 8-block radius,
// but only when the frame is fully built (42 prismarine). Old code
// scaled it (half of grant radius) — wrong on both counts.
export const HOSTILE_DAMAGE_RADIUS = 8;
export function hostileDamageRadius(q: ConduitQuery): number {
  if (!isActive(q)) return 0;
  if (q.prismarineBlocks < MAX_FRAME) return 0;
  return HOSTILE_DAMAGE_RADIUS;
}

// Damage rate: 4 HP every 2s (40 ticks) to hostile mobs in water.
export const HOSTILE_DAMAGE_INTERVAL_TICKS = 40;
export const HOSTILE_DAMAGE = 4;

export function hostileDamageThisTick(tickInActive: number, targetInWater: boolean): number {
  if (!targetInWater) return 0;
  return tickInActive % HOSTILE_DAMAGE_INTERVAL_TICKS === 0 ? HOSTILE_DAMAGE : 0;
}
