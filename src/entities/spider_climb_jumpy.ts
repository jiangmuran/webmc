export interface SpiderState {
  adjacentToWall: boolean;
  onGround: boolean;
  hasJockey: boolean;
  sneakingTarget: boolean;
}

export function canClimb(s: SpiderState): boolean {
  return s.adjacentToWall;
}

export function jumpChance(s: SpiderState): number {
  if (!s.onGround) return 0;
  return s.hasJockey ? 0.01 : 0.05;
}

// Wiki (minecraft.wiki/w/Spider): "A spider stays hostile toward the
// player or an iron golem as long as the light level immediately
// around the spider is 11 or less; otherwise, it does not attack
// unless attacked first." Time-of-day is irrelevant — what matters
// is the light level immediately around the spider, regardless of
// whether it's day or night. Old code only checked light during
// daytime, leaving spiders aggressive at night under torches/lit
// rooms with light ≥ 12 (vs wiki: passive there too). Sibling
// spider_daylight_passive.ts uses the same `light ≤ 11 → hostile`
// rule.
export function shouldAggro(light: number, _isDaytime: boolean, sneakingTarget: boolean): boolean {
  if (sneakingTarget) return false;
  return light <= 11;
}
