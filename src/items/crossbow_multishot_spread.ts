export const MULTISHOT_COUNT = 3;
export const SPREAD_ANGLE_DEGREES = 10;

export function multishotAngles(): readonly number[] {
  return [-SPREAD_ANGLE_DEGREES, 0, SPREAD_ANGLE_DEGREES];
}

export function piercingHitLimit(piercingLevel: number): number {
  return piercingLevel + 1;
}

export function quickChargeReduction(level: number): number {
  return Math.min(1, 0.25 * level);
}

export function baseChargeTicks(level: number): number {
  return Math.max(1, Math.floor(25 * (1 - quickChargeReduction(level))));
}
