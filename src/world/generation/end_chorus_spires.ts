export interface SpireParams {
  height: number;
  trunkRadius: number;
  branches: number;
}

export const MIN_HEIGHT = 5;
export const MAX_HEIGHT = 11;

export function rollSpire(rng: () => number): SpireParams {
  const height = MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1));
  return {
    height,
    trunkRadius: 1 + Math.floor(rng() * 2),
    branches: Math.floor(rng() * (Math.floor(height / 2) + 1)),
  };
}

export function dropsPopped(): string {
  return 'popped_chorus_fruit';
}

export function onlyGrowsOnEndStone(): boolean {
  return true;
}
