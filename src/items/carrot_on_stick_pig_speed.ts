export interface PigMount {
  hasSaddle: boolean;
  hasCarrotOnStick: boolean;
  boostTicksRemaining: number;
}

export const BOOST_DURATION_TICKS = 20 * 2;
export const BASE_SPEED = 0.225;
export const BOOST_SPEED = 0.338;

export function useCarrotOnStick(s: PigMount): PigMount {
  if (!s.hasSaddle || !s.hasCarrotOnStick) return s;
  return { ...s, boostTicksRemaining: BOOST_DURATION_TICKS };
}

export function speed(s: PigMount): number {
  if (!s.hasSaddle) return 0;
  return s.boostTicksRemaining > 0 ? BOOST_SPEED : BASE_SPEED;
}

export function tick(s: PigMount): PigMount {
  if (s.boostTicksRemaining <= 0) return s;
  return { ...s, boostTicksRemaining: s.boostTicksRemaining - 1 };
}
