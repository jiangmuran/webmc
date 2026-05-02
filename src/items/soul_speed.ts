// Soul Speed (boots). Faster walking on soul sand / soul soil; damages
// boots over time.
//
// Wiki (minecraft.wiki/w/Soul_Speed): "the player's speed is adjusted
// by the multiplier (Soul Speed Level * 0.105) + 1.3."
// Old `1 + 0.21 × level + 0.19` overstated the per-level boost by 2×:
//   L=1: 1.40 (matches wiki 1.405) — close
//   L=2: 1.61 (vs wiki 1.51)        — 6% too fast
//   L=3: 1.82 (vs wiki 1.615)       — 13% too fast

export const SOUL_SPEED_MAX = 3;

export interface SoulSpeedCtx {
  onSoulBlock: boolean;
  level: number;
}

export function speedMultiplier(c: SoulSpeedCtx): number {
  if (!c.onSoulBlock || c.level <= 0) return 1;
  const eff = Math.min(SOUL_SPEED_MAX, c.level);
  return eff * 0.105 + 1.3;
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
