// Pointed dripstone formation. Water dripping from a stalactite forms
// a stalagmite below. Dripstone column growth: 10-minute intervals for
// +1 block when a water drop lands on dirt/path/gravel 11 blocks below.

export interface DripstoneFormation {
  direction: 'up' | 'down';
  height: number;
}

const GROWTH_INTERVAL_SEC = 600;
const MAX_HEIGHT = 11;

export function makeDripstone(direction: 'up' | 'down'): DripstoneFormation {
  return { direction, height: 1 };
}

export interface GrowthQuery {
  waterDripping: boolean;
  dtSec: number;
  rng: () => number;
}

export interface GrowthState {
  accumulatorSec: number;
}

export function makeGrowthState(): GrowthState {
  return { accumulatorSec: 0 };
}

export function tickGrowth(
  formation: DripstoneFormation,
  state: GrowthState,
  q: GrowthQuery,
): boolean {
  if (!q.waterDripping) return false;
  if (formation.height >= MAX_HEIGHT) return false;
  state.accumulatorSec += q.dtSec;
  if (state.accumulatorSec >= GROWTH_INTERVAL_SEC) {
    state.accumulatorSec = 0;
    if (q.rng() < 0.5) {
      formation.height++;
      return true;
    }
  }
  return false;
}
