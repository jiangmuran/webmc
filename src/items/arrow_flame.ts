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
// Wiki (minecraft.wiki/w/Power): Power bonus = floor(base * (0.25 *
// level + 0.25)). Old `floor(0.25 * (level+1) + 0.5)` was a flat
// number (1 at level 1, 2 at level 5) and did NOT scale with base —
// Power V on a 6-hp shot gave +2, not +9. This was the third copy
// of the same bug across arrow modules; siblings arrow_crit_damage
// and arrow_critical now both use the wiki formula.
export function arrowDamage(powerLevel: number, velocity: number, critical: boolean): number {
  const base = Math.max(1, Math.ceil(2 * velocity));
  const powerBonus = powerLevel > 0 ? Math.floor(base * (0.25 * powerLevel + 0.25)) : 0;
  const critBonus = critical ? Math.floor(Math.random() * (base / 2 + 1)) : 0;
  return base + powerBonus + critBonus;
}

// Fire-immune mobs (zombified piglins, blazes, magma cubes, etc.).
const FIRE_IMMUNE = new Set<string>([
  'blaze',
  'magma_cube',
  'ghast',
  'strider',
  'wither',
  'wither_skeleton',
  'zombified_piglin',
  'skeleton_horse',
]);

export function isFireImmune(mob: string): boolean {
  return FIRE_IMMUNE.has(mob);
}
