// Shield blocking. A shield must be raised for ~5 ticks (250ms) before
// it begins absorbing. Axe attacks disable the shield for 5s.
// Arrows, melee, and explosion damage from in-front are fully blocked.

export interface ShieldState {
  raisedSinceMs: number | null;
  disabledUntilMs: number;
}

export function makeShield(): ShieldState {
  return { raisedSinceMs: null, disabledUntilMs: 0 };
}

export const SHIELD_READY_MS = 250;
export const AXE_DISABLE_MS = 5000;

export function raise(s: ShieldState, nowMs: number): void {
  s.raisedSinceMs ??= nowMs;
}

export function lower(s: ShieldState): void {
  s.raisedSinceMs = null;
}

export function disableByAxe(s: ShieldState, nowMs: number): void {
  s.disabledUntilMs = nowMs + AXE_DISABLE_MS;
  s.raisedSinceMs = null;
}

export interface BlockQuery {
  nowMs: number;
  attackerDirFromDefender: 'front' | 'side' | 'back';
  damageKind: 'melee' | 'projectile' | 'explosion' | 'fire';
}

export function damageAfterBlock(
  s: ShieldState,
  q: BlockQuery,
  rawDamage: number,
): { damage: number; blocked: boolean } {
  if (s.disabledUntilMs > q.nowMs) return { damage: rawDamage, blocked: false };
  if (s.raisedSinceMs === null) return { damage: rawDamage, blocked: false };
  if (q.nowMs - s.raisedSinceMs < SHIELD_READY_MS) return { damage: rawDamage, blocked: false };
  if (q.attackerDirFromDefender !== 'front') return { damage: rawDamage, blocked: false };
  if (q.damageKind === 'fire') return { damage: rawDamage, blocked: false };
  return { damage: 0, blocked: true };
}
