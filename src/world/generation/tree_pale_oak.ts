export interface PaleOak {
  trunkHeight: number;
  creakingHeartSpawns: boolean;
}

export const MIN_HEIGHT = 7;
export const MAX_HEIGHT = 10;

export function rollPaleOak(rng: () => number): PaleOak {
  return {
    trunkHeight: MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1)),
    creakingHeartSpawns: rng() < 0.1,
  };
}

export function biome(): string {
  return 'pale_garden';
}

export function dropsResinClumpChance(): number {
  return 0.1;
}
