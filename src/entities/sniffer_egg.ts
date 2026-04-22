// Sniffer egg. Dropped by archaeology / suspicious sand. Hatches after
// 20 minutes on plain blocks; moss accelerates to 10 min.

export interface SnifferEggState {
  hatchProgressSec: number;
  totalHatchSec: number;
}

const PLAIN_HATCH_SEC = 20 * 60;
const MOSS_HATCH_SEC = 10 * 60;

export function makeSnifferEgg(onMoss = false): SnifferEggState {
  return {
    hatchProgressSec: 0,
    totalHatchSec: onMoss ? MOSS_HATCH_SEC : PLAIN_HATCH_SEC,
  };
}

export interface EggTickResult {
  hatched: boolean;
  cracks: number; // 0..2 visual cracks
}

export function tickSnifferEgg(state: SnifferEggState, dtSec: number): EggTickResult {
  state.hatchProgressSec += dtSec;
  const progress = state.hatchProgressSec / state.totalHatchSec;
  const cracks = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
  return { hatched: state.hatchProgressSec >= state.totalHatchSec, cracks };
}
