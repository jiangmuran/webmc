export interface Mangrove {
  height: number;
  propaguleDrop: boolean;
  rootsSpan: number;
}

export const MIN_HEIGHT = 4;
export const MAX_HEIGHT = 7;

export function rollMangrove(rng: () => number): Mangrove {
  return {
    height: MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1)),
    propaguleDrop: rng() < 0.1,
    rootsSpan: 2 + Math.floor(rng() * 3),
  };
}

export function growsOnMud(): boolean {
  return true;
}

export function rootsCanWaterlog(): boolean {
  return true;
}
