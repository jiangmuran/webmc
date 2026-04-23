export interface ImpaleHit {
  target: string;
  impalingLevel: number;
}

export const BASE_BONUS_PER_LEVEL = 2.5;

export function bonusDamage(h: ImpaleHit): number {
  if (h.impalingLevel <= 0) return 0;
  if (h.target === 'player' || isAquatic(h.target)) {
    return h.impalingLevel * BASE_BONUS_PER_LEVEL;
  }
  return 0;
}

export function isAquatic(mob: string): boolean {
  return ['squid', 'guardian', 'elder_guardian', 'cod', 'salmon', 'dolphin', 'turtle', 'tropical_fish', 'axolotl'].includes(
    mob,
  );
}
