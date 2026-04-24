export interface CarverInput {
  chunkX: number;
  chunkZ: number;
  worldSeed: number;
  rng: () => number;
}

export function caveStartsInChunk(i: CarverInput): boolean {
  return i.rng() < 1 / 15;
}

export function canyonStartsInChunk(i: CarverInput): boolean {
  return i.rng() < 1 / 50;
}

export function noodleCaveWidth(y: number, rng: () => number): number {
  const base = 1.5 + rng() * 2;
  const yFactor = 1 - Math.abs(y - 0) / 64;
  return Math.max(1, base * Math.max(0.5, yFactor));
}

export function cheeseCaveDensity(y: number): number {
  if (y > 0) return 0;
  if (y < -50) return 0.3;
  return 0.1 + (Math.abs(y) / 50) * 0.2;
}
