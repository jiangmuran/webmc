// Blaze fireball. Shoots 3 small fireballs per volley, 5 volleys
// per attack. 20-tick pause between shots, ~60-tick pause between
// attacks.

export interface BlazeAttack {
  volleysFiredThisAttack: number;
  shotsThisVolley: number;
  nextShotAtMs: number;
  nextAttackAtMs: number;
}

export const SHOTS_PER_VOLLEY = 3;
export const VOLLEYS_PER_ATTACK = 5;
export const SHOT_INTERVAL_MS = 1000;
export const ATTACK_COOLDOWN_MS = 3000;

export function makeBlaze(): BlazeAttack {
  return {
    volleysFiredThisAttack: 0,
    shotsThisVolley: 0,
    nextShotAtMs: 0,
    nextAttackAtMs: 0,
  };
}

export interface FireQuery {
  nowMs: number;
  targetInRange: boolean;
}

export interface FireResult {
  fired: boolean;
  volleyComplete: boolean;
  attackComplete: boolean;
}

export function tryFire(b: BlazeAttack, q: FireQuery): FireResult {
  if (!q.targetInRange) return { fired: false, volleyComplete: false, attackComplete: false };
  if (q.nowMs < b.nextShotAtMs) {
    return { fired: false, volleyComplete: false, attackComplete: false };
  }
  if (q.nowMs < b.nextAttackAtMs) {
    return { fired: false, volleyComplete: false, attackComplete: false };
  }
  b.shotsThisVolley += 1;
  b.nextShotAtMs = q.nowMs + SHOT_INTERVAL_MS;
  if (b.shotsThisVolley >= SHOTS_PER_VOLLEY) {
    b.shotsThisVolley = 0;
    b.volleysFiredThisAttack += 1;
    if (b.volleysFiredThisAttack >= VOLLEYS_PER_ATTACK) {
      b.volleysFiredThisAttack = 0;
      b.nextAttackAtMs = q.nowMs + ATTACK_COOLDOWN_MS;
      return { fired: true, volleyComplete: true, attackComplete: true };
    }
    return { fired: true, volleyComplete: true, attackComplete: false };
  }
  return { fired: true, volleyComplete: false, attackComplete: false };
}
