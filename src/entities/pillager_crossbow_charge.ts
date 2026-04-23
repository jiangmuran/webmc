export interface PillagerState {
  targetDistance: number;
  chargeTicks: number;
  cooldownTicks: number;
}

export const CHARGE_REQUIRED_TICKS = 20;
export const ATTACK_RANGE = 8;

export function inRange(s: PillagerState): boolean {
  return s.targetDistance <= ATTACK_RANGE;
}

export function charging(s: PillagerState): boolean {
  return inRange(s) && s.chargeTicks < CHARGE_REQUIRED_TICKS;
}

export function readyToFire(s: PillagerState): boolean {
  return inRange(s) && s.chargeTicks >= CHARGE_REQUIRED_TICKS && s.cooldownTicks <= 0;
}
