// Llama spit. Untamed llama spits when attacked; tamed llama spits
// at nearby hostiles. Spit projectile, 1 damage, slight knockback.

export interface Llama {
  tamed: boolean;
  ownerId: string | null;
  lastSpitMs: number;
}

export const SPIT_COOLDOWN_MS = 2000;
export const SPIT_DAMAGE = 1;
export const SPIT_RANGE = 10;

export function makeLlama(tamed = false): Llama {
  return { tamed, ownerId: null, lastSpitMs: -Infinity };
}

export interface SpitQuery {
  nowMs: number;
  targetId: string | null;
  targetDistance: number;
  attackedRecently: boolean;
}

export function trySpit(l: Llama, q: SpitQuery): boolean {
  if (!q.targetId) return false;
  if (q.targetDistance > SPIT_RANGE) return false;
  if (q.nowMs - l.lastSpitMs < SPIT_COOLDOWN_MS) return false;
  if (!l.tamed && !q.attackedRecently) return false;
  l.lastSpitMs = q.nowMs;
  return true;
}

// Spit velocity function: simple aimed throw.
export function spitVelocity(
  dx: number,
  dy: number,
  dz: number,
): { x: number; y: number; z: number } {
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const speed = 1.5;
  return { x: (dx / len) * speed, y: (dy / len) * speed, z: (dz / len) * speed };
}
