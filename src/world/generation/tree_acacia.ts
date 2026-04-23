export interface Acacia {
  trunkHeight: number;
  branchAngle: number;
  canopyRadius: number;
}

export const MIN_HEIGHT = 5;
export const MAX_HEIGHT = 8;

export function rollAcacia(rng: () => number): Acacia {
  return {
    trunkHeight: MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1)),
    branchAngle: Math.floor(rng() * 8) * (Math.PI / 4),
    canopyRadius: 3 + Math.floor(rng() * 2),
  };
}

export function canopyIsFlat(): boolean {
  return true;
}

export function biomeAcacia(biome: string): boolean {
  return biome === 'savanna' || biome === 'savanna_plateau' || biome === 'windswept_savanna';
}
