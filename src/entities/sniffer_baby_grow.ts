// Wiki (minecraft.wiki/w/Sniffer): "Snifflets require 48000 game
// ticks to grow up into adult sniffers, which is equal to 40 minutes
// or two in-game days, twice as long as most other baby mobs."
// Old GROW_TICKS = 24000 (20 min) was half the wiki value — sniffers
// matured at the speed of normal baby mobs instead of the wiki's
// 2× duration.
export const GROW_TICKS = 48000;

// Wiki (minecraft.wiki/w/Sniffer_Egg): "Once placed by a player, a
// sniffer egg hatches after 20 minutes if placed on most blocks,
// or 10 minutes if placed on a moss block." 20 min = 24000 ticks
// (default / non-moss case). Sibling sniffer_egg_hatch.ts holds
// the moss/non-moss split (12000 / 24000); this constant is the
// non-moss baseline.
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
