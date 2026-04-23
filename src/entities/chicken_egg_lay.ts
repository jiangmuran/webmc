// Chickens lay an egg every 5-10 min.

export const EGG_LAY_MIN_TICKS = 6000;
export const EGG_LAY_MAX_TICKS = 12000;

export interface ChickenCtx {
  ticksUntilNextEgg: number;
  isBaby: boolean;
}

export function rollNextEggDelay(rand: () => number): number {
  return EGG_LAY_MIN_TICKS + Math.floor(rand() * (EGG_LAY_MAX_TICKS - EGG_LAY_MIN_TICKS));
}

export function tick(c: ChickenCtx): { state: ChickenCtx; laidEgg: boolean } {
  if (c.isBaby) return { state: c, laidEgg: false };
  if (c.ticksUntilNextEgg <= 1) {
    return { state: { ...c, ticksUntilNextEgg: rollNextEggDelay(Math.random) }, laidEgg: true };
  }
  return { state: { ...c, ticksUntilNextEgg: c.ticksUntilNextEgg - 1 }, laidEgg: false };
}

export function thrownEggHatchesChickenChance(): number {
  return 1 / 8;
}

export function rareTripleHatch(): number {
  return 1 / 32;
}
