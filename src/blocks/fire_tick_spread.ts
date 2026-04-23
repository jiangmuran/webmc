export interface FireCandidate {
  flammability: number;
  encouragement: number;
  age: number;
  rain: boolean;
  humid: boolean;
}

export const MAX_AGE = 15;

export function shouldExtinguish(f: FireCandidate, rng: () => number): boolean {
  if (f.rain) return true;
  if (f.humid && rng() < 0.5) return true;
  return false;
}

export function canSpreadTo(
  flammability: number,
  encouragement: number,
  rng: () => number,
): boolean {
  if (flammability <= 0) return false;
  const chance = (flammability + encouragement) / 100;
  return rng() < chance;
}

export function tickAge(age: number, rng: () => number): number {
  if (age >= MAX_AGE) return MAX_AGE;
  if (rng() < 0.1) return age + 1;
  return age;
}
