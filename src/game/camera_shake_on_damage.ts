export const DAMAGE_SHAKE_DURATION_TICKS = 10;

export interface ShakeState {
  ticksRemaining: number;
  amplitude: number;
}

export function onDamage(s: ShakeState, damage: number): ShakeState {
  const amp = Math.min(1, damage / 10);
  return {
    ticksRemaining: DAMAGE_SHAKE_DURATION_TICKS,
    amplitude: Math.max(s.amplitude, amp),
  };
}

export function tick(s: ShakeState): ShakeState {
  return {
    ticksRemaining: Math.max(0, s.ticksRemaining - 1),
    amplitude: s.ticksRemaining <= 1 ? 0 : s.amplitude * 0.8,
  };
}

export function currentOffset(s: ShakeState, rng: () => number): { dx: number; dy: number } {
  if (s.ticksRemaining <= 0) return { dx: 0, dy: 0 };
  return { dx: (rng() - 0.5) * s.amplitude, dy: (rng() - 0.5) * s.amplitude };
}
