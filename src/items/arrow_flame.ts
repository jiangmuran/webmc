// Flame arrow behavior. Arrows fired from a Flame-enchanted bow ignite
// entities on hit for 5 seconds (burning source = player). Fire-immune
// entities don't burn but are still pierced.

export interface FlameArrowQuery {
  flameLevel: number; // 0..1 (Flame is max level 1)
  powerLevel: number;
  targetIsFireImmune: boolean;
}

export const FLAME_BURN_SEC = 5;

export interface FlameArrowHitResult {
  burnDurationSec: number;
  applied: boolean;
}

export function onFlameArrowHit(q: FlameArrowQuery): FlameArrowHitResult {
  if (q.flameLevel <= 0) return { burnDurationSec: 0, applied: false };
  if (q.targetIsFireImmune) return { burnDurationSec: 0, applied: false };
  return { burnDurationSec: FLAME_BURN_SEC, applied: true };
}

// Arrow damage formula. Flame does NOT modify damage — only ignition.
//
// Wiki (minecraft.wiki/w/Power): "Power increases arrow damage by
// 25% × (level + 1), rounded up to nearest half-heart." Damage in
// MC is in half-heart units, so "rounded up" = Math.ceil. Old
// Math.floor rounded DOWN, under-shooting on fractional bonuses
// (e.g. base=5, Power IV: bonus 6.25 → floor=6 vs ceil=7).
// Siblings arrow_critical.ts, arrow_trajectory.ts, and
// arrow_crit_damage.ts all use Math.ceil now.
export function arrowDamage(powerLevel: number, velocity: number, critical: boolean): number {
  const base = Math.max(1, Math.ceil(2 * velocity));
  const powerBonus = powerLevel > 0 ? Math.ceil(base * (0.25 * powerLevel + 0.25)) : 0;
  const critBonus = critical ? Math.floor(Math.random() * (base / 2 + 1)) : 0;
  return base + powerBonus + critBonus;
}

// Wiki (minecraft.wiki/w/Damage#Immunity): mobs immune to fire damage.
// Removed `skeleton_horse` — wiki says it does not burn in SUNLIGHT
// (a separate mechanic) but takes normal fire damage from arrows,
// lava, and fire blocks. Added `ender_dragon` which is wiki-canonical
// fire-immune (e.g. lava in The End deals no damage to it).
const FIRE_IMMUNE = new Set<string>([
  'blaze',
  'magma_cube',
  'ghast',
  'strider',
  'wither',
  'wither_skeleton',
  'zombified_piglin',
  'ender_dragon',
]);

export function isFireImmune(mob: string): boolean {
  return FIRE_IMMUNE.has(mob);
}
