export interface PlayerNearDolphin {
  ticksSinceLastDolphinTouch: number;
}

// Wiki (minecraft.wiki/w/Dolphin's_Grace): the Dolphin's Grace effect
// boosts swim speed by ~40% (multiplier 1.4) and lasts 100 ticks.
// Old SWIM_SPEED_MULT=1.3 was 10 percentage-points short of the
// canonical value. Sibling dolphin_boost.ts already uses 1.4.
export const GRACE_DURATION = 100;
export const SWIM_SPEED_MULT = 1.4;

export function hasGrace(p: PlayerNearDolphin): boolean {
  return p.ticksSinceLastDolphinTouch < GRACE_DURATION;
}

export function swimMultiplier(p: PlayerNearDolphin): number {
  return hasGrace(p) ? SWIM_SPEED_MULT : 1;
}
