// Ghast. Floats randomly; when seeing a player within 64 blocks
// horizontally and 4 blocks vertically (Java) fires a fireball every
// 3 s. Fireball can be batted back with a melee hit.
//
// Wiki (minecraft.wiki/w/Ghast#Behavior, citing MC-49640 WAI):
// "Java: they target players within 64 blocks horizontally and 4
// blocks vertically." Old code only enforced a single euclidean
// `distance` ≤ 64, so a ghast 60 blocks above (or below) a player
// would still acquire targets — wiki-incorrect. `distance` is now
// interpreted as the horizontal (XZ) distance; `distanceY` is the
// signed vertical offset and must be |Δy| ≤ 4.

export interface GhastState {
  targetId: string | null;
  lastFireMs: number;
  idleFloatPhase: number;
}

export const DETECT_RANGE = 64;
export const DETECT_RANGE_VERTICAL = 4;
export const FIRE_INTERVAL_MS = 3000;

export function makeGhast(): GhastState {
  return { targetId: null, lastFireMs: -Infinity, idleFloatPhase: 0 };
}

export interface TargetQuery {
  visiblePlayerId: string | null;
  distance: number; // horizontal (XZ) distance
  distanceY?: number; // signed vertical offset; default 0 (same height)
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
  if (Math.abs(q.distanceY ?? 0) > DETECT_RANGE_VERTICAL) {
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
