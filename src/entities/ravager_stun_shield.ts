export const STUN_DURATION_TICKS = 60;
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
