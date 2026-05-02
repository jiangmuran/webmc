export const MULTISHOT_COUNT = 3;
export const SPREAD_ANGLE_DEGREES = 10;

export function multishotAngles(): readonly number[] {
  return [-SPREAD_ANGLE_DEGREES, 0, SPREAD_ANGLE_DEGREES];
}

export function piercingHitLimit(piercingLevel: number): number {
  return piercingLevel + 1;
}

// Wiki (minecraft.wiki/w/Quick_Charge): vanilla max level is III in
// survival; each level subtracts 0.25 s (5 ticks) from the 1.25 s
// (25-tick) base charge. Quick Charge III gives 10-tick charge.
// Levels above III only reachable via commands; clamping at III
// matches enchant_max_level_table.ts. Old reduction was a fraction of
// total time (0.25 * level), which clipped IV to 1 tick early.
export const QUICK_CHARGE_MAX = 3;
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
