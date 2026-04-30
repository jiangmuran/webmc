// Warden sonic boom. Ranged attack (15-20 blocks), ~5s cooldown.
// Ignores armor, affects any entity in the line path (1-block wide).

export interface WardenSonic {
  hp: number;
  lastSonicMs: number;
}

export const SONIC_RANGE = 20;
export const SONIC_COOLDOWN_MS = 5000;
export const SONIC_DAMAGE = 10;

export function makeWarden(hp = 500): WardenSonic {
  return { hp, lastSonicMs: -Infinity };
}

export interface FireQuery {
  nowMs: number;
  targetDistance: number;
  hasLineOfSight: boolean;
}

export interface FireResult {
  fired: boolean;
  reason: 'ok' | 'cooldown' | 'out_of_range' | 'no_los';
}

export function tryFireSonic(w: WardenSonic, q: FireQuery): FireResult {
  if (q.targetDistance > SONIC_RANGE) return { fired: false, reason: 'out_of_range' };
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
