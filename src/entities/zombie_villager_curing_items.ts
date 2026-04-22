// Zombie-villager cure. Apply Weakness (splash potion or effect cloud)
// + give Golden Apple → enters cure state. Cure duration scales with
// certain surrounding blocks (iron bars and beds nearby speed it up).

export interface CureState {
  inProgress: boolean;
  timeRemainingTicks: number;
  speedBonus: number;
}

export const BASE_CURE_TICKS = 3600; // 3 min
export const IRON_BARS_SPEEDUP = 0.04;
export const BED_SPEEDUP = 0.01;

export function makeCureState(): CureState {
  return { inProgress: false, timeRemainingTicks: 0, speedBonus: 0 };
}

export interface StartCureQuery {
  hasWeaknessEffect: boolean;
  usedGoldenApple: boolean;
}

export function tryStartCure(s: CureState, q: StartCureQuery): boolean {
  if (s.inProgress) return false;
  if (!q.hasWeaknessEffect || !q.usedGoldenApple) return false;
  s.inProgress = true;
  s.timeRemainingTicks = BASE_CURE_TICKS;
  return true;
}

export interface SpeedupQuery {
  ironBarsNearby: number;
  bedsNearby: number;
}

export function applySpeedup(s: CureState, q: SpeedupQuery): void {
  s.speedBonus = Math.min(0.99, q.ironBarsNearby * IRON_BARS_SPEEDUP + q.bedsNearby * BED_SPEEDUP);
}

export function tickCure(s: CureState, deltaTicks: number): 'cured' | 'progress' | 'idle' {
  if (!s.inProgress) return 'idle';
  const effective = deltaTicks * (1 + s.speedBonus);
  s.timeRemainingTicks -= effective;
  if (s.timeRemainingTicks <= 0) {
    s.inProgress = false;
    return 'cured';
  }
  return 'progress';
}
