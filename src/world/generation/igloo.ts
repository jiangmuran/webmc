// Igloo. Small snow structure on snowy biomes; 50% chance of a basement
// (trapdoor under the carpet) with a zombie villager, normal villager in
// cells, a cauldron with splash potion of weakness, and a golden apple.

export interface IglooLayout {
  hasBasement: boolean;
  basementDepth: number; // 7 blocks in MC
  hasGoldenApple: boolean;
  hasPotionOfWeakness: boolean;
}

export interface IglooQuery {
  basementRoll: number; // 0..1 — <0.5 generates basement
}

export function planIgloo(q: IglooQuery): IglooLayout {
  const hasBasement = q.basementRoll < 0.5;
  return {
    hasBasement,
    basementDepth: hasBasement ? 7 : 0,
    hasGoldenApple: hasBasement,
    hasPotionOfWeakness: hasBasement,
  };
}

// Healing a zombie villager:
//   1. Throw a splash potion of weakness on the villager.
//   2. Feed it a golden apple.
//   3. After 3-5 minutes (here: 4 minutes), it becomes a villager.
export const ZOMBIE_VILLAGER_CURE_SEC = 240;

export interface CureState {
  hasWeakness: boolean;
  hasGoldenApple: boolean;
  elapsedSec: number;
  cured: boolean;
}

export function makeCureState(): CureState {
  return { hasWeakness: false, hasGoldenApple: false, elapsedSec: 0, cured: false };
}

export function applyWeakness(s: CureState): void {
  s.hasWeakness = true;
}

export function feedGoldenApple(s: CureState): boolean {
  if (!s.hasWeakness) return false;
  s.hasGoldenApple = true;
  return true;
}

export function tickCure(s: CureState, dtSec: number): boolean {
  if (!s.hasWeakness || !s.hasGoldenApple || s.cured) return false;
  s.elapsedSec += dtSec;
  if (s.elapsedSec >= ZOMBIE_VILLAGER_CURE_SEC) {
    s.cured = true;
    return true;
  }
  return false;
}
