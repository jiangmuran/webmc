// Villager breeding. Two adult villagers with willingness > 0 can
// breed when beds+food are available. Cooldown 5 min after birth.

export interface VillagerBreedState {
  isAdult: boolean;
  willingness: number; // 0..N (food unlocks)
  lastBirthMs: number;
}

export const BIRTH_COOLDOWN_MS = 5 * 60_000;
export const WILLINGNESS_FROM_FOOD = 1;

export function canBreed(
  a: VillagerBreedState,
  b: VillagerBreedState,
  nowMs: number,
  availableBedsForBaby: number,
): boolean {
  if (!a.isAdult || !b.isAdult) return false;
  if (a.willingness <= 0 || b.willingness <= 0) return false;
  if (nowMs - a.lastBirthMs < BIRTH_COOLDOWN_MS) return false;
  if (nowMs - b.lastBirthMs < BIRTH_COOLDOWN_MS) return false;
  if (availableBedsForBaby <= 0) return false;
  return true;
}

export function breed(a: VillagerBreedState, b: VillagerBreedState, nowMs: number): void {
  a.willingness = 0;
  b.willingness = 0;
  a.lastBirthMs = nowMs;
  b.lastBirthMs = nowMs;
}

export function feed(v: VillagerBreedState): void {
  v.willingness += WILLINGNESS_FROM_FOOD;
}
