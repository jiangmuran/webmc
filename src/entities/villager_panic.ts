// Villager panic: runs to nearest house/iron golem when a zombie is
// nearby or they've been hurt recently.

export const PANIC_DURATION_TICKS = 100;

export interface PanicCtx {
  recentAttackTicks: number;
  nearbyHostile: boolean;
  nearbyIronGolem: boolean;
  timeOfDayIsNight: boolean;
}

export function inPanic(c: PanicCtx): boolean {
  return c.recentAttackTicks > 0 || c.nearbyHostile;
}

export function runsToward(c: PanicCtx): 'iron_golem' | 'house' | 'none' {
  if (!inPanic(c)) return 'none';
  if (c.nearbyIronGolem) return 'iron_golem';
  return 'house';
}

export function rememberAttacker(cooldownTicks: number): number {
  return Math.max(cooldownTicks, PANIC_DURATION_TICKS);
}

export function tickDown(recentAttackTicks: number): number {
  return Math.max(0, recentAttackTicks - 1);
}
