// Pointed dripstone. Water source above → fills cauldron below slowly
// with water. Lava above → fills with lava. Drip particles continuous.

export type FluidAbove = 'water' | 'lava' | 'none';

export const DRIP_FILL_AVG_TICKS_WATER = 17000; // ~14 min
export const DRIP_FILL_AVG_TICKS_LAVA = 34000; // ~28 min

export function fillsCauldron(above: FluidAbove): boolean {
  return above !== 'none';
}

export function avgFillTicks(above: FluidAbove): number {
  if (above === 'water') return DRIP_FILL_AVG_TICKS_WATER;
  if (above === 'lava') return DRIP_FILL_AVG_TICKS_LAVA;
  return Infinity;
}

export function rollFillThisTick(above: FluidAbove, rand: () => number): boolean {
  const t = avgFillTicks(above);
  if (t === Infinity) return false;
  return rand() < 1 / t;
}

export function resultingCauldron(above: FluidAbove): 'water_cauldron' | 'lava_cauldron' | null {
  if (above === 'water') return 'water_cauldron';
  if (above === 'lava') return 'lava_cauldron';
  return null;
}
