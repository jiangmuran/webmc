// Zombie-villager cure. Apply Weakness (splash potion or effect cloud)
// + give Golden Apple → enters cure state. Cure duration scales with
// certain surrounding blocks (iron bars and beds nearby speed it up).
//
// Wiki (minecraft.wiki/w/Zombie_Villager#Curing): the cure timer is
// a random integer between 3600 and 6000 ticks; iron bars and bed
// halves (capped at 14) within a 9³ cube each contribute 0.3%
// speedup, summing to a 4.2% maximum.
//
// Old code:
//   BASE_CURE_TICKS hard-coded at 3600 (the floor of the random range,
//     so every cure took the wiki minimum)
//   IRON_BARS_SPEEDUP = 0.04 / BED_SPEEDUP = 0.01 — per-block bonuses
//     ~13× / ~3× larger than wiki's 0.3% (a single iron bar gave 4%
//     speedup vs wiki's 0.3%; 8 iron bars maxed out the 99% cap and
//     reduced cure time by 99%, vs wiki cap of 4.2%)

export interface CureState {
  inProgress: boolean;
  timeRemainingTicks: number;
  speedBonus: number;
}

export const BASE_CURE_MIN_TICKS = 3600;
export const BASE_CURE_MAX_TICKS = 6000;
export const BASE_CURE_TICKS = 4800; // midpoint default
export const ACCELERANT_CAP = 14;
export const SPEEDUP_PER_ACCELERANT = 0.003;
export const MAX_SPEEDUP = ACCELERANT_CAP * SPEEDUP_PER_ACCELERANT; // 0.042

export function makeCureState(): CureState {
  return { inProgress: false, timeRemainingTicks: 0, speedBonus: 0 };
}

export interface StartCureQuery {
  hasWeaknessEffect: boolean;
  usedGoldenApple: boolean;
  rng?: () => number;
}

export function tryStartCure(s: CureState, q: StartCureQuery): boolean {
  if (s.inProgress) return false;
  if (!q.hasWeaknessEffect || !q.usedGoldenApple) return false;
  s.inProgress = true;
  if (q.rng) {
    s.timeRemainingTicks =
      BASE_CURE_MIN_TICKS + Math.floor(q.rng() * (BASE_CURE_MAX_TICKS - BASE_CURE_MIN_TICKS + 1));
  } else {
    s.timeRemainingTicks = BASE_CURE_TICKS;
  }
  return true;
}

export interface SpeedupQuery {
  ironBarsNearby: number;
  bedsNearby: number;
}

export function applySpeedup(s: CureState, q: SpeedupQuery): void {
  const accel = Math.min(ACCELERANT_CAP, q.ironBarsNearby + q.bedsNearby);
  s.speedBonus = accel * SPEEDUP_PER_ACCELERANT;
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
