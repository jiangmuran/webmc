export const DEFAULT_RANDOM_TICK_SPEED = 3;
export const SECTION_VOLUME = 16 * 16 * 16;

export interface RandomTickInput {
  sectionCount: number;
  randomTickSpeed: number;
  rng: () => number;
}

export function samplesForTick(i: RandomTickInput): { section: number; localIndex: number }[] {
  const out: { section: number; localIndex: number }[] = [];
  for (let s = 0; s < i.sectionCount; s++) {
    for (let k = 0; k < i.randomTickSpeed; k++) {
      out.push({ section: s, localIndex: Math.floor(i.rng() * SECTION_VOLUME) });
    }
  }
  return out;
}

export function expectedTicksPerBlockPerGameTick(i: { randomTickSpeed: number }): number {
  return i.randomTickSpeed / SECTION_VOLUME;
}
