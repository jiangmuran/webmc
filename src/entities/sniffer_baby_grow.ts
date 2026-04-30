// Wiki (minecraft.wiki/w/Snifflet): "Snifflets, like other babies,
// take 20 minutes to grow up." 20 min = 24000 ticks.
export const GROW_TICKS = 24000;
// Wiki (minecraft.wiki/w/Sniffer_Egg): "hatches in 20 minutes when
// placed on moss, 40 minutes anywhere else." Old value 12000 (10
// min) was half the wiki's moss baseline; sibling
// sniffer_egg_hatch.ts already uses 24000 / 48000.
export const EGG_HATCH_TICKS = 24000;

export function shouldHatch(egg: { ageTicks: number }): boolean {
  return egg.ageTicks >= EGG_HATCH_TICKS;
}

export function isBabyGrown(baby: { ageTicks: number }): boolean {
  return baby.ageTicks >= GROW_TICKS;
}

export function hatchSpeedMultInWarmBiome(isWarm: boolean): number {
  return isWarm ? 2 : 1;
}
