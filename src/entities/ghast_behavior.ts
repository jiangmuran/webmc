// Ghast. Floats randomly; when seeing a player within 64 blocks fires
// a fireball every ~3s. Fireball can be batted back with a melee hit.

export interface GhastState {
  targetId: string | null;
  lastFireMs: number;
  idleFloatPhase: number;
}

export const DETECT_RANGE = 64;
export const FIRE_INTERVAL_MS = 3000;

export function makeGhast(): GhastState {
  return { targetId: null, lastFireMs: -Infinity, idleFloatPhase: 0 };
}

export interface TargetQuery {
  visiblePlayerId: string | null;
  distance: number;
  hasLineOfSight: boolean;
}

export interface FireQuery {
  nowMs: number;
}

export function acquire(s: GhastState, q: TargetQuery): void {
  if (!q.visiblePlayerId || q.distance > DETECT_RANGE || !q.hasLineOfSight) {
    s.targetId = null;
    return;
  }
  s.targetId = q.visiblePlayerId;
}

export function tryFire(s: GhastState, q: FireQuery): boolean {
  if (s.targetId === null) return false;
  if (q.nowMs - s.lastFireMs < FIRE_INTERVAL_MS) return false;
  s.lastFireMs = q.nowMs;
  return true;
}

export interface FireballHit {
  hitByMelee: boolean;
  attackerId: string;
  ghastId: string;
}

// Batted fireballs: redirected at attacker; if that's the ghast, it
// takes damage.
export interface DeflectResult {
  damagedGhastId: string | null;
  redirectTargetId: string | null;
}

export function deflect(f: FireballHit): DeflectResult {
  if (!f.hitByMelee) return { damagedGhastId: null, redirectTargetId: null };
  if (f.attackerId === f.ghastId) {
    return { damagedGhastId: f.ghastId, redirectTargetId: null };
  }
  return { damagedGhastId: null, redirectTargetId: f.ghastId };
}
