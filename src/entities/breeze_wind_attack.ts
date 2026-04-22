// Breeze. Hostile mob in trial chambers. Shoots wind-charge projectiles
// that knock back; immune to projectile damage.

export interface Breeze {
  hp: number;
  maxHp: number;
  lastChargeMs: number;
  charging: boolean;
}

export const CHARGE_COOLDOWN_MS = 3000;
export const MAX_HP = 30;

export function makeBreeze(): Breeze {
  return { hp: MAX_HP, maxHp: MAX_HP, lastChargeMs: -Infinity, charging: false };
}

export interface DamageQuery {
  amount: number;
  kind: 'melee' | 'projectile' | 'explosion' | 'other';
}

export function damageBreeze(b: Breeze, q: DamageQuery): number {
  if (q.kind === 'projectile') return 0; // immune
  const applied = q.amount;
  b.hp = Math.max(0, b.hp - applied);
  return applied;
}

export interface AttackQuery {
  nowMs: number;
  targetInRange: boolean;
}

export function tryChargeWindCharge(b: Breeze, q: AttackQuery): boolean {
  if (!q.targetInRange) return false;
  if (q.nowMs - b.lastChargeMs < CHARGE_COOLDOWN_MS) return false;
  b.lastChargeMs = q.nowMs;
  return true;
}

// Wind charge knock-back formula.
export const WIND_CHARGE_KNOCKBACK = 1.5;

export function knockbackVector(
  dx: number,
  dy: number,
  dz: number,
): { x: number; y: number; z: number } {
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  return {
    x: (dx / len) * WIND_CHARGE_KNOCKBACK,
    y: (dy / len) * WIND_CHARGE_KNOCKBACK,
    z: (dz / len) * WIND_CHARGE_KNOCKBACK,
  };
}
