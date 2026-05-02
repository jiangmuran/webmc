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

// Wiki (minecraft.wiki/w/Egg): "When a player throws an egg, there
// is a 1⁄8 (12.5%) chance to spawn a baby chicken. There is a 1⁄256
// (~0.4%) chance for an egg to hatch 4 chicks instead of 1."
//
// So the rare hatch is 4 chicks (not 3) and the chance is 1/256
// (not 1/32). Old `rareTripleHatch = 1/32` was 8× the wiki rate AND
// produced the wrong number of chicks. Function kept under the same
// name for caller compatibility; new `rareQuadHatch` is the
// wiki-accurate primitive (4 chicks @ 1/256).
export const EGG_HATCH_CHANCE = 1 / 8;
export const RARE_QUAD_HATCH_CHANCE = 1 / 256;

export function thrownEggHatchesChickenChance(): number {
  return EGG_HATCH_CHANCE;
}

export function rareQuadHatch(): number {
  return RARE_QUAD_HATCH_CHANCE;
}

/** @deprecated Use rareQuadHatch (1/256, 4 chicks) per wiki. */
export function rareTripleHatch(): number {
  return RARE_QUAD_HATCH_CHANCE;
}
