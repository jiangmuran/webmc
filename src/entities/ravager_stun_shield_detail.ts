// Wiki (minecraft.wiki/w/Ravager#Stunning): "When a ravager's bite
// attack is blocked by a shield, no damage is dealt and knockback is
// halved, but the shield loses a considerable amount of durability.
// The ravager also has a 50% chance to become stunned and unable to
// move or attack for 2 seconds."
//
// Old code required 2 deterministic deflections before stunning —
// that's nowhere in the wiki. A single shield block has a 50%
// chance to stun for 2 s (40 ticks). Tracking shieldDeflectCount is
// preserved as a debug counter; the stun decision is now per-hit
// stochastic.

export interface RavagerStun {
  stunned: boolean;
  stunTicksRemaining: number;
  shieldDeflectCount: number;
}

export const STUN_DURATION = 40;
export const STUN_CHANCE_PER_BLOCK = 0.5;

export function onDeflectedAttack(r: RavagerStun, rng: () => number = Math.random): RavagerStun {
  const next = { ...r, shieldDeflectCount: r.shieldDeflectCount + 1 };
  if (rng() < STUN_CHANCE_PER_BLOCK) {
    next.stunned = true;
    next.stunTicksRemaining = STUN_DURATION;
  }
  return next;
}

export function isVulnerableToArrows(r: RavagerStun): boolean {
  return r.stunned;
}
