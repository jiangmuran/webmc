// Wiki (minecraft.wiki/w/Ravager): "When a ravager attacks a player
// blocking with a shield, the ravager is stunned for 40 ticks (2 s)."
// Old 60-tick (3 s) duration was 1.5× the wiki value, leaving the
// ravager helpless 1 s longer than vanilla. Siblings ravager_stun.ts
// and ravager_stun_shield_detail.ts both already use 40.
export const STUN_DURATION_TICKS = 40;
export const ROAR_DURATION_TICKS = 20;

export interface RavagerState {
  ticksSinceStunned: number;
  isRoaring: boolean;
  roarTicksRemaining: number;
  attackCooldown: number;
}

export function onShieldBlocked(s: RavagerState): RavagerState {
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
