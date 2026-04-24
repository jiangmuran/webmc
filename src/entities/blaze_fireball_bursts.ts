export interface BlazeAttackState {
  ticksSinceLastShot: number;
  inBurst: boolean;
  shotsInBurst: number;
}

export const BURST_SHOT_COUNT = 3;
export const BURST_SHOT_INTERVAL = 6;
export const COOLDOWN_AFTER_BURST = 100;

export function shouldShoot(s: BlazeAttackState, targetInSight: boolean): boolean {
  if (!targetInSight) return false;
  if (s.inBurst) return s.ticksSinceLastShot >= BURST_SHOT_INTERVAL;
  return s.ticksSinceLastShot >= COOLDOWN_AFTER_BURST;
}

export function recordShot(s: BlazeAttackState): BlazeAttackState {
  const next = s.shotsInBurst + 1;
  return {
    ticksSinceLastShot: 0,
    inBurst: next < BURST_SHOT_COUNT,
    shotsInBurst: next >= BURST_SHOT_COUNT ? 0 : next,
  };
}

export function tick(s: BlazeAttackState): BlazeAttackState {
  return { ...s, ticksSinceLastShot: s.ticksSinceLastShot + 1 };
}
