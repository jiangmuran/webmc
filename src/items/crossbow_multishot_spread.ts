export const MULTISHOT_COUNT = 3;
export const SPREAD_ANGLE_DEGREES = 10;

export function multishotAngles(): readonly number[] {
  return [-SPREAD_ANGLE_DEGREES, 0, SPREAD_ANGLE_DEGREES];
}

export function piercingHitLimit(piercingLevel: number): number {
  return piercingLevel + 1;
}

// Wiki (minecraft.wiki/w/Quick_Charge): each level subtracts 0.25s
// (5 ticks) from the 1.25s (25-tick) base charge. Max level is 5,
// at which point charge time → 0. Old code expressed reduction as
// 0.25 * level (fraction of total time), which made Quick Charge IV
// clip to 1-tick already and capped Quick Charge V at the same — no
// difference between IV and V.
export const QUICK_CHARGE_MAX = 5;
export const BASE_CHARGE_TICKS = 25;
export const QUICK_CHARGE_TICKS_PER_LEVEL = 5;

export function quickChargeReduction(level: number): number {
  const eff = Math.max(0, Math.min(QUICK_CHARGE_MAX, level));
  return Math.min(1, eff / QUICK_CHARGE_MAX);
}

export function baseChargeTicks(level: number): number {
  const eff = Math.max(0, Math.min(QUICK_CHARGE_MAX, level));
  const remaining = BASE_CHARGE_TICKS - eff * QUICK_CHARGE_TICKS_PER_LEVEL;
  return Math.max(1, remaining);
}
