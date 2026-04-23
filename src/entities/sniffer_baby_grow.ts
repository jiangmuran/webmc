export const GROW_TICKS = 24000 * 2;
export const EGG_HATCH_TICKS = 12000;

export function shouldHatch(egg: { ageTicks: number }): boolean {
  return egg.ageTicks >= EGG_HATCH_TICKS;
}

export function isBabyGrown(baby: { ageTicks: number }): boolean {
  return baby.ageTicks >= GROW_TICKS;
}

export function hatchSpeedMultInWarmBiome(isWarm: boolean): number {
  return isWarm ? 2 : 1;
}
