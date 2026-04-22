// Turtle eggs: laid on sand at home beach. Hatch at night on sand over
// a series of random ticks. Mobs trample unless cat/ocelot.

export interface TurtleEgg {
  stage: 0 | 1 | 2; // 0 = fresh, 2 = ready to hatch
  onSand: boolean;
}

export const EGG_RANDOM_TICK_CHANCE_NIGHT = 0.35;
export const EGG_RANDOM_TICK_CHANCE_DAY = 0.015;

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
