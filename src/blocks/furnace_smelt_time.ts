export const DEFAULT_SMELT_TIME_TICKS = 200;
export const BLAST_FURNACE_TIME_TICKS = 100;
export const SMOKER_TIME_TICKS = 100;

export function smeltTime(kind: 'furnace' | 'blast_furnace' | 'smoker'): number {
  if (kind === 'blast_furnace') return BLAST_FURNACE_TIME_TICKS;
  if (kind === 'smoker') return SMOKER_TIME_TICKS;
  return DEFAULT_SMELT_TIME_TICKS;
}

export function fuelTickAtBurnTime(fuelBurnTicks: number, cookTicks: number): number {
  if (fuelBurnTicks <= 0) return 0;
  return Math.min(cookTicks, fuelBurnTicks);
}
