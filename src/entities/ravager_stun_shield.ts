// Wiki (minecraft.wiki/w/Ravager#Stunning): "When a ravager's bite
// attack is blocked by a shield, no damage is dealt and knockback
// is halved, but the shield loses a considerable amount of
// durability. The ravager also has a 50% chance to become stunned
// and unable to move or attack for 2 seconds, signified by
// gray/purple effect particles. After this period, it opens its
// mouth and roars, dealing 6 damage and a knockback of 5 blocks
// to nearby entities."
//
// Old onShieldBlocked applied the stun unconditionally — the wiki
// only sees a 50% chance per blocked attack. Siblings
// ravager_stun.ts and ravager_stun_shield_detail.ts already use
// the correct 40-tick duration; the chance gate is the new piece.
export const STUN_DURATION_TICKS = 40;
export const ROAR_DURATION_TICKS = 20;
export const STUN_ON_BLOCK_CHANCE = 0.5;

export interface RavagerState {
  ticksSinceStunned: number;
  isRoaring: boolean;
  roarTicksRemaining: number;
  attackCooldown: number;
}

export function onShieldBlocked(s: RavagerState, rand: () => number = Math.random): RavagerState {
  if (rand() >= STUN_ON_BLOCK_CHANCE) {
    return { ...s, ticksSinceStunned: 0 };
  }
  return { ...s, ticksSinceStunned: 0, attackCooldown: STUN_DURATION_TICKS };
}

export function tick(s: RavagerState): RavagerState {
  return {
    ticksSinceStunned: s.ticksSinceStunned + 1,
    isRoaring: s.roarTicksRemaining > 1,
    roarTicksRemaining: Math.max(0, s.roarTicksRemaining - 1),
    attackCooldown: Math.max(0, s.attackCooldown - 1),
  };
}

export function startRoar(s: RavagerState): RavagerState {
  return { ...s, isRoaring: true, roarTicksRemaining: ROAR_DURATION_TICKS };
}

export function canAttack(s: RavagerState): boolean {
  return s.attackCooldown === 0 && !s.isRoaring;
}
