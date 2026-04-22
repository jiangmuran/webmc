// Stray: snowy-biome skeleton variant. Shoots tipped arrows applying
// Slowness. Drops arrow of slowness on death.

export const STRAY_SLOWNESS_DURATION_TICKS = 600;
export const STRAY_SLOWNESS_AMPLIFIER = 0;

export interface StrayShot {
  arrowType: 'tipped_slowness';
  slownessDurationTicks: number;
  amplifier: number;
}

export function nextShot(): StrayShot {
  return {
    arrowType: 'tipped_slowness',
    slownessDurationTicks: STRAY_SLOWNESS_DURATION_TICKS,
    amplifier: STRAY_SLOWNESS_AMPLIFIER,
  };
}

export function dropsOnDeath(rand: () => number): string[] {
  const drops: string[] = ['bone'];
  if (rand() < 0.5) drops.push('arrow_slowness');
  return drops;
}

export function onlySpawnsInSnowyBiomes(biome: string): boolean {
  return biome.includes('snowy') || biome === 'frozen_ocean' || biome === 'frozen_river';
}
