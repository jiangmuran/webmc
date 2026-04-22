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

// Arrow damage formula: base 2 HP + critical bonus + 0.5 per Power level.
// Flame does NOT modify damage — only ignition.
export function arrowDamage(powerLevel: number, velocity: number, critical: boolean): number {
  const base = Math.max(1, Math.ceil(2 * velocity));
  const powerBonus = powerLevel > 0 ? Math.floor(0.25 * (powerLevel + 1) + 0.5) : 0;
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
