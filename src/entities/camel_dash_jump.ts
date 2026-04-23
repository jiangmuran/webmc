// Camel dash and stand-up. Camels have a dash boost (sprint + forward)
// and sit down when not ridden for a while.

export const CAMEL_DASH_COOLDOWN_TICKS = 55;
export const CAMEL_DASH_IMPULSE = 22 / 20; // blocks/tick
export const CAMEL_DASH_HORIZONTAL_MULT = 1.45;

export interface CamelCtx {
  cooldownRemaining: number;
  riding: boolean;
  sitting: boolean;
  lastRideTicksAgo: number;
}

export function canDash(c: CamelCtx): boolean {
  return c.riding && !c.sitting && c.cooldownRemaining <= 0;
}

export function beginDash(c: CamelCtx): CamelCtx {
  if (!canDash(c)) return c;
  return { ...c, cooldownRemaining: CAMEL_DASH_COOLDOWN_TICKS };
}

export const SIT_IDLE_TICKS = 20 * 60; // 1 minute idle → sit

export function shouldSit(c: CamelCtx): boolean {
  return !c.riding && c.lastRideTicksAgo > SIT_IDLE_TICKS;
}
