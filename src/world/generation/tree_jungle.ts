export interface Jungle {
  height: number;
  thick: boolean;
  vines: boolean;
}

export const MIN_HEIGHT = 5;
export const MAX_HEIGHT = 11;
export const THICK_HEIGHT = 20;

export function rollJungle(rng: () => number): Jungle {
  const thick = rng() < 0.1;
  const height = thick ? THICK_HEIGHT : MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1));
  return { height, thick, vines: true };
}

export function trunkBlockCount(j: Jungle): number {
  return j.thick ? j.height * 4 : j.height;
}

export function cocoaChance(): number {
  return 0.05;
}
