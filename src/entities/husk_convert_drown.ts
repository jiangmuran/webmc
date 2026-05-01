// Husk: desert zombie variant. Submerged for 30 s starts the
// husk → zombie conversion, which takes an additional 15 s
// (uninterruptible) — full conversion at 45 s = 900 ticks. Bites
// inflict Hunger.
//
// Wiki (minecraft.wiki/w/Husk):
//   "A husk that is fully submerged in water for 30 seconds begins
//   converting to a normal zombie, which takes an additional 15
//   seconds and cannot be stopped even if the husk leaves water."
// So full conversion = 30 + 15 = 45 s = 900 ticks. Old constant was
// 600 ticks (30 s) — the start of conversion, not its completion;
// husks turned into zombies 15 s before wiki canon. Sibling
// zombie_drown_convert.ts uses 900 for the parallel zombie→drowned.
//
// Bite Hunger duration is 7 s on Normal (140 ticks) and 14 s on
// Hard (280 ticks). Old hard value was 300 ticks (15 s), one second
// too long.
export const HUSK_HUNGER_DURATION_TICKS = 140;
export const HUSK_HUNGER_DURATION_HARD = 280;
export const HUSK_CONVERT_START_TICKS = 600; // 30 s — conversion locks in
export const HUSK_DROWN_TICKS = 900; // 30 s + 15 s — fully converted

export interface HuskState {
  immersionTicks: number;
}

export function onBiteHunger(difficulty: 'normal' | 'hard'): number {
  return difficulty === 'hard' ? HUSK_HUNGER_DURATION_HARD : HUSK_HUNGER_DURATION_TICKS;
}

export function drowns(s: HuskState): boolean {
  return s.immersionTicks >= HUSK_DROWN_TICKS;
}

export function underwaterTick(s: HuskState, inWater: boolean): HuskState {
  if (!inWater) return { immersionTicks: 0 };
  return { immersionTicks: s.immersionTicks + 1 };
}

export function convertsInto(): string {
  return 'zombie';
}

export function burnsInSun(): boolean {
  return false;
}
