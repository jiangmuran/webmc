// Breach (mace-only). Reduces target armor effectiveness by 15% per level.

export const BREACH_MAX = 4;

export function armorEffectivenessFactor(level: number): number {
  const eff = Math.max(0, Math.min(BREACH_MAX, level));
  return Math.max(0, 1 - 0.15 * eff);
}

export function armorAfter(rawArmor: number, level: number): number {
  return rawArmor * armorEffectivenessFactor(level);
}

export function appliesOnlyTo(itemKind: string): boolean {
  return itemKind === 'mace';
}

export function incompatibleWith(): string[] {
  return ['density'];
}
