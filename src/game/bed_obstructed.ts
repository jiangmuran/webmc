// Bed respawn obstruction. When respawning, if the bed or its surroundings
// are blocked, search a safe cell in a 3x3x2 box; else fall back.

export interface Cell {
  x: number;
  y: number;
  z: number;
  solidBelow: boolean;
  airAt: boolean;
  airAbove: boolean;
}

export function isSafeSpawn(c: Cell): boolean {
  return c.solidBelow && c.airAt && c.airAbove;
}

export function searchRespawnSpot(candidates: Cell[]): Cell | null {
  for (const c of candidates) if (isSafeSpawn(c)) return c;
  return null;
}

export const RESPAWN_SEARCH_RADIUS = 3;

export function bedObstructedError(): string {
  return 'Your home bed was missing or obstructed.';
}
