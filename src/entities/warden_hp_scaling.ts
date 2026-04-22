// Warden HP. 500 health — the highest HP in the game. Immune to
// fire/lava. Damaged by smite enchant.

export interface Warden {
  hp: number;
  maxHp: number;
}

export const WARDEN_MAX_HP = 500;

export function makeWarden(): Warden {
  return { hp: WARDEN_MAX_HP, maxHp: WARDEN_MAX_HP };
}

export type DamageKind =
  | 'melee'
  | 'projectile'
  | 'fire'
  | 'lava'
  | 'fall'
  | 'drowning'
  | 'explosion'
  | 'magic'
  | 'smite';

export interface DamageQuery {
  amount: number;
  kind: DamageKind;
}

export function damageWarden(w: Warden, q: DamageQuery): number {
  if (q.kind === 'fire' || q.kind === 'lava') return 0;
  const mult = q.kind === 'smite' ? 1 : 1; // Smite doesn't apply (undead-only)
  const taken = Math.round(q.amount * mult);
  w.hp = Math.max(0, w.hp - taken);
  return taken;
}

// Warden regenerates if player leaves area (rare).
export const REGEN_COOLDOWN_TICKS = 200;

export function regenIfCalm(w: Warden, calmTicks: number, deltaTicks: number): number {
  if (calmTicks < REGEN_COOLDOWN_TICKS) return 0;
  const heal = Math.floor(deltaTicks / 20);
  w.hp = Math.min(w.maxHp, w.hp + heal);
  return heal;
}
