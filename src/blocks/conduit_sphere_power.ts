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

// Range is floor(blocks / 7) * 16 + 16, capped at 96.
export function grantRadius(q: ConduitQuery): number {
  if (!isActive(q)) return 0;
  const frames = Math.min(MAX_FRAME, q.prismarineBlocks);
  const tiers = Math.floor(frames / 7);
  return Math.min(96, tiers * 16 + 16);
}

// Max frame 42 → tiers 6 → 96. Damages hostile mobs at half radius.
export function hostileDamageRadius(q: ConduitQuery): number {
  return Math.floor(grantRadius(q) / 2);
}

// Damage rate: 4 HP every 2s (40 ticks) to hostile mobs in water.
export const HOSTILE_DAMAGE_INTERVAL_TICKS = 40;
export const HOSTILE_DAMAGE = 4;

export function hostileDamageThisTick(tickInActive: number, targetInWater: boolean): number {
  if (!targetInWater) return 0;
  return tickInActive % HOSTILE_DAMAGE_INTERVAL_TICKS === 0 ? HOSTILE_DAMAGE : 0;
}
