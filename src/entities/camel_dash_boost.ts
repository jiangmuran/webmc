export interface CamelState {
  saddled: boolean;
  isSitting: boolean;
  dashCooldownTicks: number;
  currentSpeed: number;
}

export const DASH_COOLDOWN_TICKS = 55;
export const DASH_BOOST_TICKS = 10;
export const DASH_VELOCITY = 0.8;

export function canDash(s: CamelState): boolean {
  if (!s.saddled || s.isSitting) return false;
  return s.dashCooldownTicks === 0;
}

export function startDash(s: CamelState): CamelState {
  if (!canDash(s)) return s;
  return {
    ...s,
    dashCooldownTicks: DASH_COOLDOWN_TICKS,
    currentSpeed: DASH_VELOCITY,
  };
}

export function tick(s: CamelState): CamelState {
  return {
    ...s,
    dashCooldownTicks: Math.max(0, s.dashCooldownTicks - 1),
  };
}
