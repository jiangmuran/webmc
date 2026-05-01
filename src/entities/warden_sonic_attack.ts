// Warden sonic boom. Ranged attack used as a fallback when the
// warden cannot reach its melee target.
//
// Wiki (minecraft.wiki/w/Warden#Sonic_boom): the sonic boom fires
// when the target is "within a 14-block radius horizontally and 20
// blocks vertically of the warden in an OVOID shape." Old SONIC_RANGE
// = 20 used a flat sphere — over-reached horizontally (20 vs 14) and
// the wrong shape. The ovoid check is (h/14)² + (v/20)² ≤ 1 where
// h = horizontal distance, v = vertical offset.
//
// Damage 10 ✓ (wiki: ignores armor, shield, and Protection enchant;
// only Resistance / wolf-armor / witch-magic-resist reduce it).
// Cooldown: warden takes 1.7 s to charge + 1.3 s to cool down = 3 s
// total before melee resumes. Old 5000 ms was 67% over wiki.

export interface WardenSonic {
  hp: number;
  lastSonicMs: number;
}

export const SONIC_RANGE_HORIZONTAL = 14;
export const SONIC_RANGE_VERTICAL = 20;
// Back-compat: the old single SONIC_RANGE constant remains; the
// bounding box of the wiki ovoid extends 20 blocks vertically, so
// callers comparing flat Euclidean distance get the wider 20-block
// far-field bound (the new ovoid check is opt-in via
// horizontalDistance/verticalDistance fields below).
export const SONIC_RANGE = SONIC_RANGE_VERTICAL;
export const SONIC_COOLDOWN_MS = 3000;
export const SONIC_DAMAGE = 10;

export function makeWarden(hp = 500): WardenSonic {
  return { hp, lastSonicMs: -Infinity };
}

export interface FireQuery {
  nowMs: number;
  /** Flat (Euclidean) distance — used when the ovoid fields are absent. */
  targetDistance: number;
  /** Horizontal-plane distance (xz). Pair with `verticalDistance` for the wiki ovoid check. */
  horizontalDistance?: number;
  /** Absolute vertical offset (y). Pair with `horizontalDistance`. */
  verticalDistance?: number;
  hasLineOfSight: boolean;
}

export interface FireResult {
  fired: boolean;
  reason: 'ok' | 'cooldown' | 'out_of_range' | 'no_los';
}

function inOvoid(h: number, v: number): boolean {
  const hRatio = h / SONIC_RANGE_HORIZONTAL;
  const vRatio = v / SONIC_RANGE_VERTICAL;
  return hRatio * hRatio + vRatio * vRatio <= 1;
}

export function tryFireSonic(w: WardenSonic, q: FireQuery): FireResult {
  const ovoidProvided = q.horizontalDistance !== undefined && q.verticalDistance !== undefined;
  const inRange = ovoidProvided
    ? inOvoid(q.horizontalDistance ?? 0, q.verticalDistance ?? 0)
    : q.targetDistance <= SONIC_RANGE;
  if (!inRange) return { fired: false, reason: 'out_of_range' };
  if (!q.hasLineOfSight) return { fired: false, reason: 'no_los' };
  if (q.nowMs - w.lastSonicMs < SONIC_COOLDOWN_MS) return { fired: false, reason: 'cooldown' };
  w.lastSonicMs = q.nowMs;
  return { fired: true, reason: 'ok' };
}

// Damage cannot be reduced by armor or shield.
export function sonicDamage(): number {
  return SONIC_DAMAGE;
}

// Vibration frequency by event. Wiki (minecraft.wiki/w/Vibration#
// Vibration_frequency) defines a 1..15 scale where the sculk sensor's
// redstone output equals the vibration frequency. Old values invented
// thresholds that didn't match canon (block_break 11 vs wiki 12,
// footstep 6 vs wiki 1, projectile_shoot 14 vs wiki 3, etc.). Now
// keyed to the wiki table:
//   Step:               1
//   Projectile Land:    2  (also Hit Ground, Splash)
//   Projectile Shoot:   3
//   Entity Damage:      7
//   Container Open:     10
//   Block Destroy:      12 (block break)
//   Block Place:        13
export const VIBRATION_PRIORITY: Record<string, number> = {
  footstep: 1,
  projectile_land: 2,
  projectile_shoot: 3,
  entity_damage: 7,
  container_open: 10,
  block_break: 12,
  block_place: 13,
  // Sculk shriek itself is not a vibration; warden anger comes from
  // the shrieker's witness call separately.
  sculk_shriek: 0,
};

export function vibrationPriorityFor(event: string): number {
  return VIBRATION_PRIORITY[event] ?? 0;
}
