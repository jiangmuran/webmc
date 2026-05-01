export interface Bee {
  angerTicks: number;
  stung: boolean;
}

// Wiki (minecraft.wiki/w/Bee): "Anger duration is randomly selected
// between 20 and 39 seconds, inclusive." → 400 to 780 ticks (20 ticks/s).
// Old `ANGER_AFTER_ATTACK = 400` flat-set anger to the wiki minimum
// only, never producing the natural [400,780] range.
export const ANGER_TICKS_MIN = 400;
export const ANGER_TICKS_MAX = 780;
/** @deprecated kept for back-compat in callers that don't pass `rand` */
export const ANGER_AFTER_ATTACK = ANGER_TICKS_MIN;

function rollAngerTicks(rand: () => number): number {
  const span = ANGER_TICKS_MAX - ANGER_TICKS_MIN + 1;
  return ANGER_TICKS_MIN + Math.floor(rand() * span);
}

export function onPlayerAttack(b: Bee, rand: () => number = () => 0): Bee {
  return { ...b, angerTicks: rollAngerTicks(rand) };
}

export function stingTarget(b: Bee): Bee {
  return { ...b, stung: true, angerTicks: 0 };
}

export function diesSoonAfterSting(b: Bee): boolean {
  return b.stung;
}

export function fleeAfterSting(b: Bee): boolean {
  return b.stung;
}
