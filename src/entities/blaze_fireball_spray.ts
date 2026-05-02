// Blaze fireball. Wiki (minecraft.wiki/w/Blaze): "shoots 3 small
// fireballs over the course of 0.9 seconds, then extinguishes its
// flames and waits for 5 seconds before attacking again." So a
// single trio per attack, ~0.3 s between shots (matching siblings
// blaze_fireball.ts and blaze_fireball_bursts.ts), 5 s cooldown.
// Old values (5 volleys/attack, 1000 ms inter-shot, 3000 ms
// cooldown) were ~5× the rate of fireballs and inconsistent with
// both other blaze modules.

export interface BlazeAttack {
  volleysFiredThisAttack: number;
  shotsThisVolley: number;
  nextShotAtMs: number;
  nextAttackAtMs: number;
}

export const SHOTS_PER_VOLLEY = 3;
export const VOLLEYS_PER_ATTACK = 1;
export const SHOT_INTERVAL_MS = 300;
export const ATTACK_COOLDOWN_MS = 5000;

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
