export const MIN_EGG_INTERVAL_TICKS = 6000;
export const MAX_EGG_INTERVAL_TICKS = 12000;

export interface ChickenState {
  ticksUntilNextEgg: number;
  isBaby: boolean;
  hasJockeyRider: boolean;
}

export function initialEggTimer(rng: () => number): number {
  return (
    MIN_EGG_INTERVAL_TICKS + Math.floor(rng() * (MAX_EGG_INTERVAL_TICKS - MIN_EGG_INTERVAL_TICKS))
  );
}

export function tickEggs(
  s: ChickenState,
  rng: () => number,
): { state: ChickenState; laid: boolean } {
  if (s.isBaby) return { state: s, laid: false };
  const next = s.ticksUntilNextEgg - 1;
  if (next <= 0) {
    return {
      state: { ...s, ticksUntilNextEgg: initialEggTimer(rng) },
      laid: true,
    };
  }
  return { state: { ...s, ticksUntilNextEgg: next }, laid: false };
}
