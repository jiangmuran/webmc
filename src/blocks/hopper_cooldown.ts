export const HOPPER_COOLDOWN_TICKS = 8;

export interface HopperState {
  cooldownTicks: number;
  locked: boolean;
}

export function canTransfer(s: HopperState): boolean {
  return !s.locked && s.cooldownTicks === 0;
}

export function onTransfer(s: HopperState): HopperState {
  return { ...s, cooldownTicks: HOPPER_COOLDOWN_TICKS };
}

export function tick(s: HopperState): HopperState {
  return { ...s, cooldownTicks: Math.max(0, s.cooldownTicks - 1) };
}
