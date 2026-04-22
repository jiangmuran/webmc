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

// Vibration detection thresholds (subscript: event → detection priority).
export const VIBRATION_PRIORITY: Record<string, number> = {
  block_break: 11,
  block_place: 11,
  footstep: 6,
  projectile_shoot: 14,
  projectile_land: 13,
  entity_damage: 10,
  sculk_shriek: 0,
};

export function vibrationPriorityFor(event: string): number {
  return VIBRATION_PRIORITY[event] ?? 0;
}
