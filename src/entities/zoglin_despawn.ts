// Zoglin. Hoglin that zombified in the overworld. Attacks all mobs
// (including piglins), never breeds. HP 40, attack 4-13.

export interface Zoglin {
  hp: number;
  maxHp: number;
  isBaby: boolean;
  angerMs: number;
}

export const ZOGLIN_MAX_HP = 40;

export function makeZoglin(isBaby = false): Zoglin {
  return { hp: ZOGLIN_MAX_HP, maxHp: ZOGLIN_MAX_HP, isBaby, angerMs: 0 };
}

export function attackDamageByDifficulty(d: 'peaceful' | 'easy' | 'normal' | 'hard'): number {
  switch (d) {
    case 'peaceful':
      return 0;
    case 'easy':
      return 2 + 1;
    case 'normal':
      return 3 + 1;
    case 'hard':
      return 4 + 2;
  }
}

// Zoglins target any living mob nearby, except other zoglins.
export function isValidTarget(mobType: string): boolean {
  return mobType !== 'zoglin';
}

// Baby zoglin attack damage is half adult.
export function attackMultiplier(isBaby: boolean): number {
  return isBaby ? 0.5 : 1;
}
