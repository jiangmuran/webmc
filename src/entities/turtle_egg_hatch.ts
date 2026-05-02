// Turtle eggs: laid on sand at home beach. Hatch at night on sand
// over a series of random ticks. Mobs trample unless cat/ocelot.
//
// Wiki (minecraft.wiki/w/Turtle_Egg): "Turtle eggs have a 1/500
// chance of cracking if they are randomly ticked during the day.
// However, if the in-game time is between 21062 and 21904 ticks
// (3:03 am and 3:54 am), then turtle eggs always crack when random
// ticked. This is a roughly 48-second window for the player. About
// 95% of eggs crack or hatch during this night-time window."
//
// Old constants (0.35 night / 0.015 day) didn't match the wiki:
// the day-tick chance of 0.015 was 7.5× the wiki's 1/500 = 0.002,
// and the "night" simplification of 0.35 averages the entire night
// even though wiki canon concentrates progression in a tight 48-s
// window. The day-chance fix matches wiki exactly; the night
// averaged value is left as a coarse approximation since no caller
// passes the precise time-of-day.

export interface TurtleEgg {
  stage: 0 | 1 | 2; // 0 = fresh, 2 = ready to hatch
  onSand: boolean;
}

export const EGG_RANDOM_TICK_CHANCE_NIGHT = 0.35;
export const EGG_RANDOM_TICK_CHANCE_DAY = 1 / 500; // wiki: 0.002

export function randomTick(e: TurtleEgg, isNight: boolean, rand: () => number): TurtleEgg {
  const p = isNight ? EGG_RANDOM_TICK_CHANCE_NIGHT : EGG_RANDOM_TICK_CHANCE_DAY;
  if (rand() >= p) return e;
  if (e.stage < 2) return { ...e, stage: (e.stage + 1) as 0 | 1 | 2 };
  return e;
}

export function hatches(e: TurtleEgg, isNight: boolean): boolean {
  return e.stage === 2 && e.onSand && isNight;
}

export function tramples(mobType: string): boolean {
  return mobType !== 'cat' && mobType !== 'ocelot' && mobType !== 'turtle';
}
