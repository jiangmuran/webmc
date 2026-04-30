// Wiki (minecraft.wiki/w/Snifflet): "Snifflets, like other babies,
// take 20 minutes to grow up." 20 min = 24000 ticks. Old constant
// was 24000 * 2 = 48000 (40 min) — 2× the wiki value.
export const GROW_TICKS = 24000;
// Wiki (minecraft.wiki/w/Sniffer_Egg): "hatches in 10 minutes when
// placed on moss, 20 minutes elsewhere." This module's
// EGG_HATCH_TICKS is the moss baseline (10 min = 12000 ticks);
// the non-moss doubling is handled by hatchSpeedMultInWarmBiome.
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
