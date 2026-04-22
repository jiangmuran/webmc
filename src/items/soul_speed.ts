// Soul Speed (boots). Faster walking on soul sand / soul soil; damages
// boots over time.

export const SOUL_SPEED_MAX = 3;

export interface SoulSpeedCtx {
  onSoulBlock: boolean;
  level: number;
}

export function speedMultiplier(c: SoulSpeedCtx): number {
  if (!c.onSoulBlock || c.level <= 0) return 1;
  // +40% at L1, +52% at L2, +64% at L3 (MC-like rough curve).
  return 1 + 0.21 * c.level + 0.19;
}

export function boostsJump(c: SoulSpeedCtx): boolean {
  return c.onSoulBlock && c.level > 0;
}

// Each tick walked on soul block has small chance to damage boots.
export function damageChancePerStep(level: number): number {
  if (level <= 0) return 0;
  return 0.04;
}

export function piglinHostileTrigger(): boolean {
  // Piglins get angry if a player wears enchanted-with-soul-speed boots.
  return true;
}
