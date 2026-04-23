export interface Chorus {
  plantHeight: number;
  ageBonus: number;
}

export const MAX_PLANT_HEIGHT = 5;

export function canBranch(c: Chorus, rng: () => number): boolean {
  if (c.plantHeight >= MAX_PLANT_HEIGHT) return false;
  const chance = 0.5 - c.plantHeight * 0.1 + c.ageBonus * 0.05;
  return rng() < chance;
}

export function breaksCascadesDown(): boolean {
  return true;
}
