// Bee pollination: bee visits flower → has_nectar → returns to hive
// → deposits honey level + ages nearby crops ~1 stage.

export interface BeeState {
  hasNectar: boolean;
  ticksSincePollen: number;
}

// Wiki: bee cooldown after pollinating is 30 seconds (600 ticks).
// Old value was 2400 (120s), 4× too long.
export const POLLINATION_COOLDOWN_TICKS = 600;
export const HIVE_DEPOSIT_HONEY_DELTA = 1;

export function pollinate(_b: BeeState): BeeState {
  return { hasNectar: true, ticksSincePollen: 0 };
}

export function canPollinateAgain(b: BeeState): boolean {
  return !b.hasNectar && b.ticksSincePollen >= POLLINATION_COOLDOWN_TICKS;
}

export interface HiveDeposit {
  honeyLevelDelta: number;
  clearedNectar: boolean;
}

export function depositAtHive(b: BeeState): { bee: BeeState; deposit: HiveDeposit | null } {
  if (!b.hasNectar) return { bee: b, deposit: null };
  return {
    bee: { hasNectar: false, ticksSincePollen: b.ticksSincePollen },
    deposit: { honeyLevelDelta: HIVE_DEPOSIT_HONEY_DELTA, clearedNectar: true },
  };
}

export function flybyAgesCrop(cropHasNeighborBeeWithNectar: boolean, rand: () => number): boolean {
  // 5% chance per tick when a nectar-bee is nearby.
  return cropHasNeighborBeeWithNectar && rand() < 0.05;
}
