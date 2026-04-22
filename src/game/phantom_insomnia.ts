// Phantom insomnia. Player sleeps in a bed → resets a 3-day timer. Going
// 3 in-game days (1 day = 24000 ticks = ~20 minutes real) without sleeping
// starts spawning phantoms at night.

const TICKS_PER_DAY = 24000;
const INSOMNIA_THRESHOLD_DAYS = 3;

export interface InsomniaState {
  ticksSinceLastSleep: number;
}

export function makeInsomnia(): InsomniaState {
  return { ticksSinceLastSleep: 0 };
}

export function onSleep(state: InsomniaState): void {
  state.ticksSinceLastSleep = 0;
}

export function addTicks(state: InsomniaState, ticks: number): void {
  state.ticksSinceLastSleep += ticks;
}

export function isInsomniac(state: InsomniaState): boolean {
  return state.ticksSinceLastSleep >= TICKS_PER_DAY * INSOMNIA_THRESHOLD_DAYS;
}

// Per-tick phantom spawn chance when insomniac + at night.
export function phantomSpawnChance(state: InsomniaState, isNight: boolean): number {
  if (!isInsomniac(state) || !isNight) return 0;
  const extraDays = state.ticksSinceLastSleep / TICKS_PER_DAY - INSOMNIA_THRESHOLD_DAYS;
  return Math.min(0.15, 0.01 + extraDays * 0.02);
}
